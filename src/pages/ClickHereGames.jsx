import React, { useState, useEffect } from "react";
import {
  FiTarget,
  FiAward,
  FiTrendingUp,
  FiStar,
  FiPlay,
  FiClock,
  FiZap,
  FiHeart,
  FiTrendingDown,
  FiCheckCircle,
} from "react-icons/fi";

const ClickHereGames = () => {
  const [currentGame, setCurrentGame] = useState("personality");
  const [gameState, setGameState] = useState("selection"); // selection, playing, results
  const [personalityScore, setPersonalityScore] = useState(0);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [gamificationLevel, setGamificationLevel] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [gameProgress, setGameProgress] = useState(0);
  const [achievements, setAchievements] = useState([]);

  const personalityQuestions = [
    {
      id: 1,
      question: "How do you typically spend your free time?",
      options: [
        {
          text: "Socializing with friends and family",
          value: "extroversion",
          score: 8,
        },
        { text: "Reading or learning new things", value: "openness", score: 7 },
        {
          text: "Organizing and planning activities",
          value: "conscientiousness",
          score: 6,
        },
        {
          text: "Helping others and volunteering",
          value: "agreeableness",
          score: 9,
        },
      ],
    },
    {
      id: 2,
      question: "When faced with a challenging situation, you usually:",
      options: [
        { text: "Seek support from others", value: "extroversion", score: 7 },
        {
          text: "Think creatively to find solutions",
          value: "openness",
          score: 8,
        },
        {
          text: "Create a step-by-step plan",
          value: "conscientiousness",
          score: 9,
        },
        {
          text: "Consider how it affects everyone involved",
          value: "agreeableness",
          score: 8,
        },
      ],
    },
    {
      id: 3,
      question: "In group activities, you prefer to:",
      options: [
        {
          text: "Take the lead and energize the group",
          value: "extroversion",
          score: 9,
        },
        {
          text: "Explore new and innovative approaches",
          value: "openness",
          score: 8,
        },
        {
          text: "Ensure everything runs smoothly",
          value: "conscientiousness",
          score: 7,
        },
        {
          text: "Mediate conflicts and build harmony",
          value: "agreeableness",
          score: 9,
        },
      ],
    },
  ];

  const memoryGame = {
    sequence: [3, 7, 1, 9, 4, 2, 8, 5],
    currentStep: 0,
    userInput: [],
    isShowing: false,
  };

  const reactionGame = {
    isActive: false,
    startTime: null,
    reactionTime: null,
    targetColor: "red",
  };

  const games = [
    {
      id: "personality",
      name: "Personality Assessment",
      description:
        "Discover your unique personality profile through interactive questions",
      icon: "🧠",
      duration: "5-10 min",
      difficulty: "Easy",
      rewards: "150 XP + Personality Badge",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: "memory",
      name: "Memory Challenge",
      description: "Test and improve your memory with pattern recognition",
      icon: "🎯",
      duration: "3-5 min",
      difficulty: "Medium",
      rewards: "200 XP + Memory Master Badge",
      color: "from-green-500 to-teal-600",
    },
    {
      id: "reaction",
      name: "Reaction Speed Test",
      description: "Measure your reflexes and response time",
      icon: "⚡",
      duration: "2-3 min",
      difficulty: "Hard",
      rewards: "250 XP + Speed Demon Badge",
      color: "from-orange-500 to-red-600",
    },
  ];

  const personalityTraits = [
    {
      trait: "Extroversion",
      score: 75,
      color: "#239d62",
      description: "Outgoing, energetic, and social",
    },
    {
      trait: "Openness",
      score: 82,
      color: "#94a3b8",
      description: "Creative, curious, and adventurous",
    },
    {
      trait: "Conscientiousness",
      score: 68,
      color: "#ffb347",
      description: "Organized, responsible, and goal-oriented",
    },
    {
      trait: "Agreeableness",
      score: 91,
      color: "#ff6961",
      description: "Compassionate, cooperative, and trusting",
    },
    {
      trait: "Neuroticism",
      score: 34,
      color: "#9b59b6",
      description: "Emotionally stable and resilient",
    },
  ];

  const handleGameStart = (gameId) => {
    setCurrentGame(gameId);
    setGameState("playing");
    setCurrentQuestion(0);
    setUserAnswers({});
    setGameProgress(0);
  };

  const handleAnswerSelect = (questionId, option) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setGameProgress(
        ((currentQuestion + 1) / personalityQuestions.length) * 100
      );
    } else {
      completePersonalityAssessment();
    }
  };

  const completePersonalityAssessment = () => {
    setGameState("results");
    setPersonalityScore(calculatePersonalityScore());
    setGamificationLevel((prev) => Math.min(prev + 1, 10));
    generateAIRecommendations();
    unlockAchievements();
  };

  const calculatePersonalityScore = () => {
    // Calculate score based on user answers
    let totalScore = 0;
    Object.values(userAnswers).forEach((answer) => {
      totalScore += answer.score;
    });
    return Math.round((totalScore / (personalityQuestions.length * 10)) * 100);
  };

  const generateAIRecommendations = () => {
    const recommendations = [
      {
        type: "activity",
        title: "Group Singing Sessions",
        description:
          "Based on your high extroversion, you'd thrive in group activities",
        icon: "🎤",
        priority: "high",
      },
      {
        type: "exercise",
        title: "Creative Art Therapy",
        description: "Your openness suggests you'd enjoy expressive activities",
        icon: "🎨",
        priority: "medium",
      },
      {
        type: "routine",
        title: "Structured Daily Schedule",
        description:
          "Your conscientiousness indicates you benefit from organization",
        icon: "📅",
        priority: "high",
      },
      {
        type: "wellness",
        title: "Mindfulness Meditation",
        description: "Practice emotional regulation and stress management",
        icon: "🧘",
        priority: "medium",
      },
    ];
    setAiRecommendations(recommendations);
  };

  const unlockAchievements = () => {
    const newAchievements = [
      {
        id: "first_assessment",
        name: "First Steps",
        description: "Completed your first personality assessment",
        icon: "🌟",
        unlocked: true,
      },
      {
        id: "high_score",
        name: "High Achiever",
        description: "Scored above 80% on assessment",
        icon: "🏆",
        unlocked: personalityScore > 80,
      },
      {
        id: "consistent",
        name: "Consistent Player",
        description: "Played games for 3 consecutive days",
        icon: "📈",
        unlocked: true,
      },
    ];
    setAchievements(newAchievements);
  };

  const renderGameContent = () => {
    switch (currentGame) {
      case "personality":
        return renderPersonalityGame();
      case "memory":
        return renderMemoryGame();
      case "reaction":
        return renderReactionGame();
      default:
        return null;
    }
  };

  const renderPersonalityGame = () => {
    if (gameState === "playing") {
      const question = personalityQuestions[currentQuestion];
      return (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {personalityQuestions.length}
              </span>
              <span className="text-sm font-medium text-[#239d62]">
                {Math.round(gameProgress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#239d62] to-[#1a7a4a] h-2 rounded-full transition-all duration-500"
                style={{ width: `${gameProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              {question.question}
            </h3>
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(question.id, option)}
                  className="w-full p-4 text-left bg-white border-2 border-gray-200 rounded-lg hover:border-[#239d62] hover:bg-[#239d62]/5 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#239d62] text-white rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderMemoryGame = () => {
    return (
      <div className="text-center">
        <div className="text-6xl mb-6">🎯</div>
        <h3 className="text-2xl font-semibold mb-4">Memory Challenge</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Watch the sequence carefully and repeat it back. Your memory skills
          will be tested!
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div
              key={num}
              className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {num}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 font-medium">
            <FiPlay className="inline mr-2" />
            Start Memory Game
          </button>
          <p className="text-sm text-gray-500">
            Difficulty: Medium | Best Time: 2.3s
          </p>
        </div>
      </div>
    );
  };

  const renderReactionGame = () => {
    return (
      <div className="text-center">
        <div className="text-6xl mb-6">⚡</div>
        <h3 className="text-2xl font-semibold mb-4">Reaction Speed Test</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Click as quickly as possible when the circle turns green. Test your
          reflexes!
        </p>

        <div className="mb-8">
          <div className="w-40 h-40 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg shadow-lg">
            Wait for Green
          </div>
        </div>

        <div className="space-y-4">
          <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-medium">
            <FiZap className="inline mr-2" />
            Start Reaction Test
          </button>
          <p className="text-sm text-gray-500">
            Difficulty: Hard | Best Time: 0.18s
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with animated background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#239d62] to-[#1a7a4a] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto p-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">🎮 Click Here Games</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Advanced cognitive assessment platform with AI-powered insights,
              personalized recommendations, and engaging gamification to enhance
              mental well-being and cognitive abilities.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FiTarget className="inline mr-2" />
                Cognitive Assessment
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FiAward className="inline mr-2" />
                AI Recommendations
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FiTrendingUp className="inline mr-2" />
                Progress Tracking
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Game Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {games.map((game) => (
            <div
              key={game.id}
              className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                currentGame === game.id
                  ? "ring-4 ring-[#239d62] ring-opacity-50"
                  : ""
              }`}
              onClick={() => handleGameStart(game.id)}
            >
              <div
                className={`bg-gradient-to-br ${game.color} rounded-2xl shadow-xl overflow-hidden`}
              >
                <div className="p-6 text-white">
                  <div className="text-5xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                  <p className="text-white/80 text-sm mb-4">
                    {game.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <FiClock className="mr-2" />
                        Duration
                      </span>
                      <span className="font-medium">{game.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Difficulty</span>
                      <span className="font-medium">{game.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rewards</span>
                      <span className="font-medium text-yellow-200">
                        {game.rewards}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                  <FiPlay className="text-2xl text-[#239d62]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Game Content Area */}
        {gameState !== "selection" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
            {renderGameContent()}
          </div>
        )}

        {/* Results Section */}
        {gameState === "results" && (
          <div className="space-y-8 mb-12">
            {/* Score Celebration */}
            <div className="bg-gradient-to-r from-[#239d62] to-[#1a7a4a] rounded-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
              <p className="text-xl opacity-90 mb-4">
                Your personalized results are ready
              </p>
              <div className="text-5xl font-bold">{personalityScore}/100</div>
              <p className="text-lg opacity-80">Overall Score</p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personality Traits */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <FiTarget className="text-3xl text-[#239d62] mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Personality Profile
                  </h3>
                </div>
                <div className="space-y-6">
                  {personalityTraits.map((trait, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-gray-800">
                            {trait.trait}
                          </span>
                          <p className="text-sm text-gray-600">
                            {trait.description}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-[#239d62]">
                          {trait.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${trait.score}%`,
                            backgroundColor: trait.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <FiTrendingUp className="text-3xl text-[#239d62] mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    AI-Powered Insights
                  </h3>
                </div>
                <div className="space-y-4">
                  {aiRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-l-4 ${
                        rec.priority === "high"
                          ? "border-l-red-500 bg-red-50"
                          : "border-l-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="text-2xl mr-3">{rec.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {rec.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {rec.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                rec.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {rec.priority === "high"
                                ? "High Priority"
                                : "Medium Priority"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gamification Dashboard */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex items-center mb-8">
            <FiAward className="text-4xl text-[#239d62] mr-4" />
            <h3 className="text-3xl font-bold text-gray-800">
              Gamification & Progress
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Level Progress */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-5xl font-bold text-[#239d62] mb-2">
                Level {gamificationLevel}
              </div>
              <p className="text-gray-600 mb-4">Current Level</p>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-[#239d62] to-[#1a7a4a] h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${(gamificationLevel % 1) * 100}%` }}
                  ></div>
                </div>
                <div className="absolute -top-2 right-0 bg-[#239d62] text-white text-xs px-2 py-1 rounded-full">
                  {Math.round((gamificationLevel % 1) * 100)}%
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl">
              <div className="text-5xl font-bold text-[#239d62] mb-2">
                {achievements.filter((a) => a.unlocked).length}
              </div>
              <p className="text-gray-600 mb-4">Achievements Unlocked</p>
              <div className="flex justify-center space-x-2">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      achievement.unlocked
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Streak */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-5xl font-bold text-[#239d62] mb-2">7</div>
              <p className="text-gray-600 mb-4">Day Streak</p>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className="w-3 h-3 bg-[#239d62] rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Level Preview */}
          <div className="bg-gradient-to-r from-[#239d62] to-[#1a7a4a] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold mb-1">
                  Next Level: {gamificationLevel + 1}
                </h4>
                <p className="opacity-90">
                  Unlock new games, features, and exclusive content
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {Math.max(0, 100 - (personalityScore || 0))} XP
                </div>
                <p className="opacity-90">XP needed to level up</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">🧠</div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">
              Cognitive Assessment
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Advanced testing for memory, reaction time, and cognitive
              abilities with detailed analytics
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">🤖</div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">
              AI Recommendations
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Personalized suggestions and activities based on comprehensive
              assessment results
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">🎮</div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">
              Gamification
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Engaging level system, achievements, and progress tracking to
              maintain motivation
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">
              Progress Analytics
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Comprehensive tracking and visualization of improvement over time
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#239d62] to-[#1a7a4a] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience the Future?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              This is just a preview. The full Click Here Games platform will
              feature advanced AI algorithms, real-time multiplayer challenges,
              and comprehensive wellness tracking.
            </p>
            <button className="bg-white text-[#239d62] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Learn More About Development
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickHereGames;
