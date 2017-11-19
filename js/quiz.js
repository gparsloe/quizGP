(function () {

    var app = angular.module('myQuiz', []);
    // he uses strings and params to id the services because of minification. See: https://www.lynda.com/AngularJS-tutorials/Setting-up-AngularJS-app-controller/373557/424022-4.html?autoplay=true

    //        app.controller = ('QuizController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

    // $sce is strict contextual escaping. This service allows us to inject html from our json file directly into the html document. We'll use that to customize the users share buttons based on their score.

    // using strings, then parameters is important for minification- or at least was when this tutorial was created.
    //Setting up the AngularJS app and controller
    //https://www.lynda.com/AngularJS-tutorials/Setting-up-AngularJS-app-controller/373557/424022-4.html?autoplay=true

    app.controller('QuizController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
        $scope.score = 0;
        $scope.activeQuestion = -1;
        $scope.activeQuestionAnswered = 0;
        $scope.percentage = 0;
        $http.get("js/quiz_data.json").then(function (quizData) {
            console.log("quizData after get: ", quizData);
            $scope.myQuestions = quizData.data;
            console.log("myQuestions: ", $scope.myQuestions);
            console.log("myQuestions[0]", $scope.myQuestions[0]);
            $scope.totalQuestions = $scope.myQuestions.length;

        }, function errorCallback(response) {
            console.log("inside errorCallback, the response: " + response);
        });


        $scope.selectAnswer = function (qIndex, aIndex) {
console.log("inside selectAnswer", qIndex, "and ", aIndex); 
            var questionState = $scope.myQuestions[qIndex].questionState;
            
            if (questionState != 'answered') {
                // question not answered yet
                $scope.myQuestions[qIndex].selectedAnswer = aIndex;
                var correctAnswer = $scope.myQuestions[qIndex].correct;
                $scope.myQuestions[qIndex].correctAnswer = correctAnswer;

                if (aIndex === correctAnswer) {
                    $scope.myQuestions[qIndex].correctness = 'correct';
                    $scope.score += 1;
                    console.log('inside selectAnswer, the score is: ' + $scope.score);
                } else {
                    $scope.myQuestions[qIndex].correctness = 'incorrect';
                }

                $scope.myQuestions[qIndex].questionState = 'answered';
            }
            $scope.percentage = (($scope.score / $scope.totalQuestions) * 100).toFixed(2);
        }
        $scope.isSelected = function (qIndex, aIndex) {
            return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
        }

        $scope.isCorrect = function (qIndex, aIndex) {
            return $scope.myQuestions[qIndex].correctAnswer === aIndex;
        }
        $scope.selectContinue = function(){
            return $scope.activeQuestion += 1;
        }
        $scope.createShareLinks = function(percentage){
            var url = 'http://codifydesign.com'; 
            var emailLink = '<a class="btn email" href="mailto:?subject=Try To beat my quiz score!&amp;body=I scored a '+percentage+'% on this quiz about Saturn. Try to beat my score at '+url+'">Email a friend</a>';
            var twitterLink = '<a class="btn twitter" target="_blank" href="https://twitter.com/intent/tweet?text=I scored a '+percentage+'% on this quiz about Saturn. Try to beat my score at&amp;hashtags=SaturnQuiz&amp;url='+url+'">Tweety your score</a>';
            var newMarkup = emailLink + twitterLink;
            return $sce.trustAsHtml(newMarkup);
        }

    }]);




})();