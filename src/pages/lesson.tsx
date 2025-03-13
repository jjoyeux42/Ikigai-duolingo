import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";

// SVG Components
import {
  CloseSvg,
  DoneSvg,
  BigCloseSvg,
  LessonTopBarHeart,
  LessonTopBarEmptyHeart,
  LessonFastForwardStartSvg,
  LessonFastForwardEndFailSvg,
  LessonFastForwardEndPassSvg,
} from "~/components/Svgs";

// IKIGAI Lesson Problems
const ikigaiProblem1 = {
  type: "SELECT_MULTIPLE",
  question: "Quelles activités ou hobbies vous font perdre la notion du temps et vous remplissent de joie ?",
  answers: [
    { icon: <div className="text-5xl">📚</div>, name: "Lecture" },
    { icon: <div className="text-5xl">🎵</div>, name: "Musique" },
    { icon: <div className="text-5xl">🏃</div>, name: "Sport" },
    { icon: <div className="text-5xl">✈️</div>, name: "Voyages" },
    { icon: <div className="text-5xl">🎭</div>, name: "Art/Culture" },
    { icon: <div className="text-5xl">🍳</div>, name: "Cuisine" },
    { icon: <div className="text-5xl">✨</div>, name: "Autre" },
  ],
  isPersonalQuestion: true,
} as const;

const ikigaiProblem2 = {
  type: "TEXT_INPUT",
  question: "Si vous pouviez consacrer tout votre temps à une seule activité, laquelle choisiriez-vous et pourquoi ?",
  placeholder: "Ex. Écrire des récits, car cela me permet d'exprimer mes émotions.",
  maxLength: 100,
  isPersonalQuestion: true,
} as const;

const ikigaiProblem3 = {
  type: "TEXT_INPUT_WITH_SUGGESTIONS",
  question: "Quelles expériences passées vous ont procuré le plus de satisfaction et de plaisir ?",
  placeholder: "Décrivez une expérience qui vous a vraiment satisfait...",
  suggestions: ["Voyage", "Collaboration", "Projet créatif", "Enseignement", "Réalisation personnelle"],
  isPersonalQuestion: true,
} as const;

// Create the IKIGAI lesson array
const ikigaiProblems = [ikigaiProblem1, ikigaiProblem2, ikigaiProblem3];

const numbersEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((_, i) => a[i] === b[i]);
};

const formatTime = (timeMs: number): string => {
  const seconds = Math.floor(timeMs / 1000) % 60;
  const minutes = Math.floor(timeMs / 1000 / 60) % 60;
  const hours = Math.floor(timeMs / 1000 / 60 / 60);
  return [hours, minutes, seconds]
    .map((x) => x.toString().padStart(2, "0"))
    .join(":");
};

const Lesson = () => {
  const router = useRouter();

  const [lessonProblem, setLessonProblem] = useState(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<null | number>(null);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [quitMessageShown, setQuitMessageShown] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [textAnswer, setTextAnswer] = useState("");

  const startTime = useRef(Date.now());
  const endTime = useRef(startTime.current + 1000 * 60 * 3 + 1000 * 33);

  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [reviewLessonShown, setReviewLessonShown] = useState(false);

  // Change this to choose between regular lessons and IKIGAI lessons
  const useIkigaiLesson = true;
  const problems = useIkigaiLesson ? ikigaiProblems : lessonProblems;
  
  const problem = problems[lessonProblem] ?? lessonProblems[0];

  const totalCorrectAnswersNeeded = useIkigaiLesson ? ikigaiProblems.length : 2;

  const [isStartingLesson, setIsStartingLesson] = useState(true);
  const hearts =
    "fast-forward" in router.query &&
    !isNaN(Number(router.query["fast-forward"]))
      ? 3 - incorrectAnswerCount
      : null;

  const isAnswerCorrect = (() => {
    if ('isPersonalQuestion' in problem && problem.isPersonalQuestion) return true;
    
    if (problem.type === "SELECT_1_OF_3") {
      return selectedAnswer === problem.correctAnswer;
    } else if (problem.type === "WRITE") {
      return numbersEqual(selectedAnswers, problem.correctAnswer);
    } else if (problem.type === "SELECT_MULTIPLE" || 
               problem.type === "TEXT_INPUT" ||
               problem.type === "TEXT_INPUT_WITH_SUGGESTIONS") {
      return true; // These are personal questions and always "correct"
    }
    return false;
  })();

  const onCheckAnswer = () => {
    setCorrectAnswerShown(true);
    if (isAnswerCorrect) {
      setCorrectAnswerCount((x) => x + 1);
    } else {
      setIncorrectAnswerCount((x) => x + 1);
    }
    
    // Save question results for review
    const newQuestionResult = {
      question: problem.question,
      yourResponse: '',
      correctResponse: 'Réponse personnelle',
    };

    if (problem.type === "SELECT_1_OF_3") {
      newQuestionResult.yourResponse = problem.answers[selectedAnswer ?? 0]?.name ?? "";
      newQuestionResult.correctResponse = problem.answers[problem.correctAnswer].name;
    } else if (problem.type === "WRITE") {
      newQuestionResult.yourResponse = selectedAnswers.map((i) => problem.answerTiles[i]).join(" ");
      newQuestionResult.correctResponse = problem.correctAnswer.map((i) => problem.answerTiles[i]).join(" ");
    } else if (problem.type === "SELECT_MULTIPLE") {
      newQuestionResult.yourResponse = selectedAnswers.map((i) => problem.answers[i].name).join(", ");
    } else if (problem.type === "TEXT_INPUT" || problem.type === "TEXT_INPUT_WITH_SUGGESTIONS") {
      newQuestionResult.yourResponse = textAnswer;
    }

    setQuestionResults((questionResults) => [...questionResults, newQuestionResult]);
  };

  const onFinish = () => {
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setTextAnswer("");
    setCorrectAnswerShown(false);
    setLessonProblem((x) => (x + 1) % problems.length);
    endTime.current = Date.now();
  };

  const onSkip = () => {
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setTextAnswer("");
    setCorrectAnswerShown(true);
  };

  const unitNumber = Number(router.query["fast-forward"]);

  useEffect(() => {
    if (hearts !== null && hearts < 0 && !correctAnswerShown) {
      return;
    }

    if (
      hearts !== null &&
      hearts >= 0 &&
      !correctAnswerShown &&
      correctAnswerCount >= totalCorrectAnswersNeeded
    ) {
      return;
    }

    if (hearts !== null && isStartingLesson) {
      return;
    }

    if (correctAnswerCount >= totalCorrectAnswersNeeded && !correctAnswerShown) {
      return;
    }
  }, [hearts, correctAnswerCount, correctAnswerShown, isStartingLesson, totalCorrectAnswersNeeded]);

  // Determine which component to render based on lesson state
  let content;
  
  if (hearts !== null && hearts < 0 && !correctAnswerShown) {
    content = (
      <LessonFastForwardEndFail
        unitNumber={unitNumber}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    );
  } else if (
    hearts !== null &&
    hearts >= 0 &&
    !correctAnswerShown &&
    correctAnswerCount >= totalCorrectAnswersNeeded
  ) {
    content = (
      <LessonFastForwardEndPass
        unitNumber={unitNumber}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    );
  } else if (hearts !== null && isStartingLesson) {
    content = (
      <LessonFastForwardStart
        unitNumber={unitNumber}
        setIsStartingLesson={setIsStartingLesson}
      />
    );
  } else if (correctAnswerCount >= totalCorrectAnswersNeeded && !correctAnswerShown) {
    content = (
      <LessonComplete
        correctAnswerCount={correctAnswerCount}
        incorrectAnswerCount={incorrectAnswerCount}
        startTime={startTime}
        endTime={endTime}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
        isIkigaiLesson={useIkigaiLesson}
      />
    );
  } else {
    // Regular lesson content based on problem type
    switch (problem.type) {
      case "SELECT_1_OF_3": {
        content = (
          <ProblemSelect1Of3
            problem={problem}
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            quitMessageShown={quitMessageShown}
            correctAnswerShown={correctAnswerShown}
            setQuitMessageShown={setQuitMessageShown}
            isAnswerCorrect={isAnswerCorrect}
            onCheckAnswer={onCheckAnswer}
            onFinish={onFinish}
            onSkip={onSkip}
            hearts={hearts}
          />
        );
        break;
      }

      case "WRITE": {
        content = (
          <ProblemWrite
            problem={problem}
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            quitMessageShown={quitMessageShown}
            correctAnswerShown={correctAnswerShown}
            setQuitMessageShown={setQuitMessageShown}
            isAnswerCorrect={isAnswerCorrect}
            onCheckAnswer={onCheckAnswer}
            onFinish={onFinish}
            onSkip={onSkip}
            hearts={hearts}
          />
        );
        break;
      }

      case "SELECT_MULTIPLE": {
        content = (
          <ProblemSelectMultiple
            problem={problem}
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            quitMessageShown={quitMessageShown}
            correctAnswerShown={correctAnswerShown}
            setQuitMessageShown={setQuitMessageShown}
            isAnswerCorrect={isAnswerCorrect}
            onCheckAnswer={onCheckAnswer}
            onFinish={onFinish}
            onSkip={onSkip}
            hearts={hearts}
          />
        );
        break;
      }

      case "TEXT_INPUT": {
        content = (
          <ProblemTextInput
            problem={problem}
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            textAnswer={textAnswer}
            setTextAnswer={setTextAnswer}
            quitMessageShown={quitMessageShown}
            correctAnswerShown={correctAnswerShown}
            setQuitMessageShown={setQuitMessageShown}
            isAnswerCorrect={isAnswerCorrect}
            onCheckAnswer={onCheckAnswer}
            onFinish={onFinish}
            onSkip={onSkip}
            hearts={hearts}
          />
        );
        break;
      }

      case "TEXT_INPUT_WITH_SUGGESTIONS": {
        content = (
          <ProblemTextInputWithSuggestions
            problem={problem}
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            textAnswer={textAnswer}
            setTextAnswer={setTextAnswer}
            quitMessageShown={quitMessageShown}
            correctAnswerShown={correctAnswerShown}
            setQuitMessageShown={setQuitMessageShown}
            isAnswerCorrect={isAnswerCorrect}
            onCheckAnswer={onCheckAnswer}
            onFinish={onFinish}
            onSkip={onSkip}
            hearts={hearts}
          />
        );
        break;
      }

      default:
        content = null;
    }
  }

  return content;
};

export default Lesson;

const ProgressBar = ({
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  setQuitMessageShown,
  hearts,
}: {
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  setQuitMessageShown: (isShown: boolean) => void;
  hearts: null | number;
}) => {
  return (
    <header className="flex items-center gap-4">
      {correctAnswerCount === 0 ? (
        <Link href="/learn" className="text-gray-400">
          <CloseSvg />
          <span className="sr-only">Exit lesson</span>
        </Link>
      ) : (
        <button
          className="text-gray-400"
          onClick={() => setQuitMessageShown(true)}
        >
          <CloseSvg />
          <span className="sr-only">Exit lesson</span>
        </button>
      )}
      <div
        className="h-4 grow rounded-full bg-gray-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={correctAnswerCount / totalCorrectAnswersNeeded}
      >
        <div
          className={
            "h-full rounded-full bg-green-500 transition-all duration-700 " +
            (correctAnswerCount > 0 ? "px-2 pt-1 " : "")
          }
          style={{
            width: `${(correctAnswerCount / totalCorrectAnswersNeeded) * 100}%`,
          }}
        >
          <div className="h-[5px] w-full rounded-full bg-green-400"></div>
        </div>
      </div>
      {hearts !== null &&
        [1, 2, 3].map((heart) => {
          if (heart <= hearts) {
            return <LessonTopBarHeart key={heart} />;
          }
          return <LessonTopBarEmptyHeart key={heart} />;
        })}
    </header>
  );
};

const QuitMessage = ({
  quitMessageShown,
  setQuitMessageShown,
}: {
  quitMessageShown: boolean;
  setQuitMessageShown: (isShown: boolean) => void;
}) => {
  return (
    <>
      <div
        className={
          quitMessageShown
            ? "fixed bottom-0 left-0 right-0 top-0 z-30 bg-black bg-opacity-60 transition-all duration-300"
            : "pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-30 bg-black bg-opacity-0 transition-all duration-300"
        }
        onClick={() => setQuitMessageShown(false)}
        aria-label="Close quit message"
        role="button"
      ></div>

      <article
        className={
          quitMessageShown
            ? "fixed bottom-0 left-0 right-0 z-40 flex flex-col gap-4 bg-white px-5 py-12 text-center transition-all duration-300 sm:flex-row"
            : "fixed -bottom-96 left-0 right-0 z-40 flex flex-col bg-white px-5 py-12 text-center transition-all duration-300 sm:flex-row"
        }
        aria-hidden={!quitMessageShown}
      >
        <div className="flex grow flex-col gap-4">
          <h2 className="text-lg font-bold sm:text-2xl">
            Are you sure you want to quit?
          </h2>
          <p className="text-gray-500 sm:text-lg">
            All progress for this wellness lesson will be lost.
          </p>
        </div>
        <div className="flex grow flex-col items-center justify-center gap-4 sm:flex-row-reverse">
          <Link
            className="flex w-full items-center justify-center rounded-2xl border-b-4 border-blue-500 bg-blue-400 py-3 font-bold uppercase text-white transition hover:brightness-105 sm:w-48"
            href="/learn"
          >
            Quit
          </Link>
          <button
            className="w-full rounded-2xl py-3 font-bold uppercase text-blue-400 transition hover:brightness-90 sm:w-48 sm:border-2 sm:border-b-4 sm:border-gray-300 sm:text-gray-400 sm:hover:bg-gray-100"
            onClick={() => setQuitMessageShown(false)}
          >
            Stay
          </button>
        </div>
      </article>
    </>
  );
};

const CheckAnswer = ({
  isAnswerSelected,
  isAnswerCorrect,
  correctAnswerShown,
  correctAnswer,
  onCheckAnswer,
  onFinish,
  onSkip,
  isPersonalQuestion = false,
}: {
  isAnswerSelected: boolean;
  isAnswerCorrect: boolean;
  correctAnswerShown: boolean;
  correctAnswer: string;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
  isPersonalQuestion?: boolean;
}) => {
  return (
    <>
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl sm:justify-between">
          <button
            className="hidden rounded-2xl border-2 border-b-4 border-gray-200 bg-white p-3 font-bold uppercase text-gray-400 transition hover:border-gray-300 hover:bg-gray-200 sm:block sm:min-w-[150px] sm:max-w-fit"
            onClick={onSkip}
          >
            Skip
          </button>
          {!isAnswerSelected ? (
            <button
              className="grow rounded-2xl bg-gray-200 p-3 font-bold uppercase text-gray-400 sm:min-w-[150px] sm:max-w-fit sm:grow-0"
              disabled
            >
              {isPersonalQuestion ? "Continuer" : "Check"}
            </button>
          ) : (
            <button
              onClick={onCheckAnswer}
              className="grow rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white sm:min-w-[150px] sm:max-w-fit sm:grow-0"
            >
              {isPersonalQuestion ? "Continuer" : "Check"}
            </button>
          )}
        </div>
      </section>

      <div
        className={
          correctAnswerShown
            ? isAnswerCorrect
              ? "fixed bottom-0 left-0 right-0 bg-lime-100 font-bold text-green-600 transition-all"
              : "fixed bottom-0 left-0 right-0 bg-red-100 font-bold text-red-500 transition-all"
            : "fixed -bottom-52 left-0 right-0"
        }
      >
        <div className="flex max-w-5xl flex-col gap-4 p-5 sm:mx-auto sm:flex-row sm:items-center sm:justify-between sm:p-10 sm:py-14">
          <>
            {isPersonalQuestion ? (
              <div className="mb-2 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="hidden rounded-full bg-white p-5 text-green-500 sm:block">
                  <DoneSvg />
                </div>
                <div className="text-2xl">Merci pour cette réflexion !</div>
              </div>
            ) : isAnswerCorrect ? (
              <div className="mb-2 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="hidden rounded-full bg-white p-5 text-green-500 sm:block">
                  <DoneSvg />
                </div>
                <div className="text-2xl">Great insight!</div>
              </div>
            ) : (
              <div className="mb-2 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="hidden rounded-full bg-white p-5 text-red-500 sm:block">
                  <BigCloseSvg />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-2xl">Correct solution:</div>{" "}
                  <div className="text-sm font-normal">{correctAnswer}</div>
                </div>
              </div>
            )}
          </>
          <button
            onClick={onFinish}
            className={
              isAnswerCorrect || isPersonalQuestion
                ? "w-full rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit"
                : "w-full rounded-2xl border-b-4 border-red-600 bg-red-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit"
            }
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

const ProblemSelect1Of3 = ({
  problem,
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  selectedAnswer,
  setSelectedAnswer,
  quitMessageShown,
  correctAnswerShown,
  setQuitMessageShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  onSkip,
  hearts,
}: {
  problem: typeof ikigaiProblem1;
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  selectedAnswer: number | null;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number | null>>;
  correctAnswerShown: boolean;
  quitMessageShown: boolean;
  setQuitMessageShown: React.Dispatch<React.SetStateAction<boolean>>;
  isAnswerCorrect: boolean;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
  hearts: number | null;
}) => {
  const { question, answers } = problem;
  const isPersonalQuestion = 'isPersonalQuestion' in problem && problem.isPersonalQuestion;

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center gap-5">
        <div className="w-full max-w-5xl sm:mt-8 sm:px-5">
          <ProgressBar
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            setQuitMessageShown={setQuitMessageShown}
            hearts={hearts}
          />
        </div>
        <section className="flex max-w-2xl grow flex-col gap-5 self-center sm:items-center sm:justify-center sm:gap-24 sm:px-5">
          <h1 className="self-start text-2xl font-bold sm:text-3xl">
            {question}
          </h1>
          <div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
            role="radiogroup"
          >
            {answers.map((answer, i) => {
              return (
                <div
                  key={i}
                  className={
                    i === selectedAnswer
                      ? "cursor-pointer rounded-xl border-2 border-b-4 border-blue-300 bg-blue-100 p-4 text-blue-400"
                      : "cursor-pointer rounded-xl border-2 border-b-4 border-gray-200 p-4 hover:bg-gray-100"
                  }
                  role="radio"
                  aria-checked={i === selectedAnswer}
                  tabIndex={0}
                  onClick={() => setSelectedAnswer(i)}
                >
                  {answer.icon}
                  <h2 className="text-center">{answer.name}</h2>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <CheckAnswer
        correctAnswer={answers[problem.correctAnswer].name}
        correctAnswerShown={correctAnswerShown}
        isAnswerCorrect={isAnswerCorrect}
        isAnswerSelected={selectedAnswer !== null}
        onCheckAnswer={onCheckAnswer}
        onFinish={onFinish}
        onSkip={onSkip}
        isPersonalQuestion={isPersonalQuestion}
      />

      <QuitMessage
        quitMessageShown={quitMessageShown}
        setQuitMessageShown={setQuitMessageShown}
      />
    </div>
  );
};

const ProblemWrite = ({
  problem,
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  selectedAnswers,
  setSelectedAnswers,
  quitMessageShown,
  correctAnswerShown,
  setQuitMessageShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  onSkip,
  hearts,
}: {
  problem: typeof ikigaiProblem2;
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  selectedAnswers: number[];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<number[]>>;
  correctAnswerShown: boolean;
  quitMessageShown: boolean;
  setQuitMessageShown: React.Dispatch<React.SetStateAction<boolean>>;
  isAnswerCorrect: boolean;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
  hearts: number | null;
}) => {
  const { question, answerTiles } = problem;
  const isPersonalQuestion = 'isPersonalQuestion' in problem && problem.isPersonalQuestion;

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center gap-5">
        <div className="w-full max-w-5xl sm:mt-8 sm:px-5">
          <ProgressBar
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            setQuitMessageShown={setQuitMessageShown}
            hearts={hearts}
          />
        </div>
        <section className="flex max-w-2xl grow flex-col gap-5 self-center sm:items-center sm:justify-center sm:gap-24">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
            Create the correct wellness practice
          </h1>

          <div className="w-full">
            <div className="flex items-center gap-2 px-2">
              <div className="text-6xl">🧘</div>
              <div className="relative ml-2 w-fit rounded-2xl border-2 border-gray-200 p-4">
                {question}
                <div
                  className="absolute h-4 w-4 rotate-45 border-b-2 border-l-2 border-gray-200 bg-white"
                  style={{
                    top: "calc(50% - 8px)",
                    left: "-10px",
                  }}
                ></div>
              </div>
            </div>

            <div className="flex min-h-[60px] flex-wrap gap-1 border-b-2 border-t-2 border-gray-200 py-1">
              {selectedAnswers.map((i) => {
                return (
                  <button
                    key={i}
                    className="rounded-2xl border-2 border-b-4 border-gray-200 p-2 text-gray-700"
                    onClick={() => {
                      setSelectedAnswers((selectedAnswers) => {
                        return selectedAnswers.filter((x) => x !== i);
                      });
                    }}
                  >
                    {answerTiles[i]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            {answerTiles.map((answerTile, i) => {
              return (
                <button
                  key={i}
                  className={
                    selectedAnswers.includes(i)
                      ? "rounded-2xl border-2 border-b-4 border-gray-200 bg-gray-200 p-2 text-gray-200"
                      : "rounded-2xl border-2 border-b-4 border-gray-200 p-2 text-gray-700"
                  }
                  disabled={selectedAnswers.includes(i)}
                  onClick={() =>
                    setSelectedAnswers((selectedAnswers) => {
                      if (selectedAnswers.includes(i)) {
                        return selectedAnswers;
                      }
                      return [...selectedAnswers, i];
                    })
                  }
                >
                  {answerTile}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <CheckAnswer
        correctAnswer={problem.correctAnswer.map((i) => answerTiles[i]).join(" ")}
        correctAnswerShown={correctAnswerShown}
        isAnswerCorrect={isAnswerCorrect}
        isAnswerSelected={selectedAnswers.length > 0}
        onCheckAnswer={onCheckAnswer}
        onFinish={onFinish}
        onSkip={onSkip}
        isPersonalQuestion={isPersonalQuestion}
      />

      <QuitMessage
        quitMessageShown={quitMessageShown}
        setQuitMessageShown={setQuitMessageShown}
      />
    </div>
  );
};

// New problem type for multiple selection questions
const ProblemSelectMultiple = ({
  problem,
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  selectedAnswers,
  setSelectedAnswers,
  quitMessageShown,
  correctAnswerShown,
  setQuitMessageShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  onSkip,
  hearts,
}: {
  problem: typeof ikigaiProblem1;
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  selectedAnswers: number[];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<number[]>>;
  correctAnswerShown: boolean;
  quitMessageShown: boolean;
  setQuitMessageShown: React.Dispatch<React.SetStateAction<boolean>>;
  isAnswerCorrect: boolean;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
  hearts: number | null;
}) => {
  const { question, answers } = problem;
  const [otherText, setOtherText] = useState("");

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center gap-5">
        <div className="w-full max-w-5xl sm:mt-8 sm:px-5">
          <ProgressBar
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            setQuitMessageShown={setQuitMessageShown}
            hearts={hearts}
          />
        </div>
        <section className="flex max-w-2xl grow flex-col gap-5 self-center sm:items-center sm:justify-center sm:gap-24 sm:px-5">
          <h1 className="self-start text-2xl font-bold sm:text-3xl">
            {question}
          </h1>
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            role="group"
          >
            {answers.map((answer, i) => {
              const isSelected = selectedAnswers.includes(i);
              const isOther = answer.name === "Autre";
              
              return (
                <div key={i} className="flex flex-col">
                  <div
                    className={
                      isSelected
                        ? "cursor-pointer rounded-xl border-2 border-b-4 border-blue-300 bg-blue-100 p-4 text-blue-400"
                        : "cursor-pointer rounded-xl border-2 border-b-4 border-gray-200 p-4 hover:bg-gray-100"
                    }
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAnswers(selectedAnswers.filter(id => id !== i));
                      } else {
                        setSelectedAnswers([...selectedAnswers, i]);
                      }
                    }}
                  >
                    {answer.icon}
                    <h2 className="text-center">{answer.name}</h2>
                  </div>
                  
                  {isSelected && isOther && (
                    <input
                      type="text"
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="Précisez..."
                      className="mt-2 rounded-xl border-2 border-blue-300 p-2 text-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <CheckAnswer
        correctAnswer=""
        correctAnswerShown={correctAnswerShown}
        isAnswerCorrect={true} // IKIGAI questions are always "correct"
        isAnswerSelected={selectedAnswers.length > 0}
        onCheckAnswer={onCheckAnswer}
        onFinish={onFinish}
        onSkip={onSkip}
        isPersonalQuestion={true}
      />

      <QuitMessage
        quitMessageShown={quitMessageShown}
        setQuitMessageShown={setQuitMessageShown}
      />
    </div>
  );
};

// Problem component for text input questions
const ProblemTextInput = ({
  problem,
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  textAnswer,
  setTextAnswer,
  quitMessageShown,
  correctAnswerShown,
  setQuitMessageShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  onSkip,
  hearts,
}: {
  problem: typeof ikigaiProblem2;
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  textAnswer: string;
  setTextAnswer: React.Dispatch<React.SetStateAction<string>>;
  correctAnswerShown: boolean;
  quitMessageShown: boolean;
  setQuitMessageShown: React.Dispatch<React.SetStateAction<boolean>>;
  isAnswerCorrect: boolean;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
  hearts: number | null;
}) => {
  const { question, placeholder, maxLength } = problem;

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center gap-5">
        <div className="w-full max-w-5xl sm:mt-8 sm:px-5">
          <ProgressBar
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            setQuitMessageShown={setQuitMessageShown}
            hearts={hearts}
          />
        </div>
        <section className="flex max-w-2xl grow flex-col gap-5 self-center sm:items-center sm:justify-center sm:gap-24 sm:px-5">
          <h1 className="self-start text-2xl font-bold sm:text-3xl">
            {question}
          </h1>
          
          <div className="w-full">
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value.slice(0, maxLength))}
              placeholder={placeholder}
              className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-blue-400 focus:outline-none"
              rows={4}
            />
            <div className="mt-2 text-right text-sm text-gray-500">
              {textAnswer.length}/{maxLength} caractères
            </div>
          </div>
        </section>
      </div>

      <CheckAnswer
        correctAnswer=""
        correctAnswerShown={correctAnswerShown}
        isAnswerCorrect={true} // IKIGAI questions are always "correct"
        isAnswerSelected={textAnswer.trim().length > 0}
        onCheckAnswer={onCheckAnswer}
        onFinish={onFinish}
        onSkip={onSkip}
        isPersonalQuestion={true}
      />

      <QuitMessage
        quitMessageShown={quitMessageShown}
        setQuitMessageShown={setQuitMessageShown}
      />
    </div>
  );
};

// Problem component for text input with suggestions
const ProblemTextInputWithSuggestions = ({
  problem,
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  textAnswer,
  setTextAnswer,
  quitMessageShown,
  correctAnswerShown,
  setQuitMessageShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  onSkip,
  hearts,
}: {
  problem: typeof ikigaiProblem3;
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  textAnswer: string;
  setTextAnswer: React.Dispatch<React.SetStateAction<string>>;
  correctAnswerShown: boolean;
  quitMessageShown: boolean;
  setQuitMessageShown: React.Dispatch<React.SetStateAction<boolean>>;
  isAnswerCorrect: boolean;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
  hearts: number | null;
}) => {
  const { question, placeholder, suggestions } = problem;

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center gap-5">
        <div className="w-full max-w-5xl sm:mt-8 sm:px-5">
          <ProgressBar
            correctAnswerCount={correctAnswerCount}
            totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
            setQuitMessageShown={setQuitMessageShown}
            hearts={hearts}
          />
        </div>
        <section className="flex max-w-2xl grow flex-col gap-5 self-center sm:items-center sm:justify-center sm:gap-24 sm:px-5">
          <h1 className="self-start text-2xl font-bold sm:text-3xl">
            {question}
          </h1>
          
          <div className="w-full">
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-blue-400 focus:outline-none"
              rows={4}
            />
            
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500">Suggestions :</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="rounded-xl border-2 border-gray-200 px-3 py-1 text-sm hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => {
                      if (textAnswer) {
                        setTextAnswer(`${textAnswer}, ${suggestion}`);
                      } else {
                        setTextAnswer(suggestion);
                      }
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <CheckAnswer
        correctAnswer=""
        correctAnswerShown={correctAnswerShown}
        isAnswerCorrect={true} // IKIGAI questions are always "correct"
        isAnswerSelected={textAnswer.trim().length > 0}
        onCheckAnswer={onCheckAnswer}
        onFinish={onFinish}
        onSkip={onSkip}
        isPersonalQuestion={true}
      />

      <QuitMessage
        quitMessageShown={quitMessageShown}
        setQuitMessageShown={setQuitMessageShown}
      />
    </div>
  );
};

type QuestionResult = {
  question: string;
  yourResponse: string;
  correctResponse: string;
};

const LessonComplete = ({
  correctAnswerCount,
  incorrectAnswerCount,
  startTime,
  endTime,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
  isIkigaiLesson = true,
}: {
  correctAnswerCount: number;
  incorrectAnswerCount: number;
  startTime: React.MutableRefObject<number>;
  endTime: React.MutableRefObject<number>;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
  isIkigaiLesson?: boolean;
}) => {
  const router = useRouter();
  const isPractice = "practice" in router.query;

  const increaseXp = useBoundStore((x) => x.increaseXp);
  const addToday = useBoundStore((x) => x.addToday);
  const increaseLingots = useBoundStore((x) => x.increaseLingots);
  const increaseLessonsCompleted = useBoundStore(
    (x) => x.increaseLessonsCompleted,
  );
  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center justify-center gap-8 font-bold">
        <h1 className="text-center text-3xl text-yellow-400">
          {isIkigaiLesson ? "Réflexion IKIGAI Complète !" : "Wellness Lesson Complete!"}
        </h1>
        <div className="flex flex-wrap justify-center gap-5">
          <div className="min-w-[110px] rounded-xl border-2 border-yellow-400 bg-yellow-400">
            <h2 className="py-1 text-center text-white">Points</h2>
            <div className="flex justify-center rounded-xl bg-white py-4 text-yellow-400">
              {correctAnswerCount * 10}
            </div>
          </div>
          <div className="min-w-[110px] rounded-xl border-2 border-blue-400 bg-blue-400">
            <h2 className="py-1 text-center text-white">Temps</h2>
            <div className="flex justify-center rounded-xl bg-white py-4 text-blue-400">
              {formatTime(endTime.current - startTime.current)}
            </div>
          </div>
          {!isIkigaiLesson && (
            <div className="min-w-[110px] rounded-xl border-2 border-green-400 bg-green-400">
              <h2 className="py-1 text-center text-white">Mindfulness</h2>
              <div className="flex justify-center rounded-xl bg-white py-4 text-green-400">
                {Math.round(
                  (correctAnswerCount /
                    (correctAnswerCount + incorrectAnswerCount)) *
                    100,
                )}
                %
              </div>
            </div>
          )}
        </div>
        
        {isIkigaiLesson && (
          <div className="max-w-md rounded-xl bg-blue-50 p-5 text-center">
            <p className="text-blue-800">
              Merci pour vos réponses ! Elles contribuent à définir votre IKIGAI - votre raison d'être. 
              Continuez votre parcours pour découvrir davantage sur vous-même.
            </p>
          </div>
        )}
      </div>
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl sm:justify-between">
          <button
            className="hidden rounded-2xl border-2 border-b-4 border-gray-200 bg-white p-3 font-bold uppercase text-gray-400 transition hover:border-gray-300 hover:bg-gray-200 sm:block sm:min-w-[150px] sm:max-w-fit"
            onClick={() => setReviewLessonShown(true)}
          >
            {isIkigaiLesson ? "Revoir mes réponses" : "Review lesson"}
          </button>
          <Link
            className={
              "flex w-full items-center justify-center rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit"
            }
            href="/learn"
            onClick={() => {
              increaseXp(correctAnswerCount * 10);
              addToday();
              increaseLingots(isPractice ? 0 : 1);
              if (!isPractice) {
                increaseLessonsCompleted();
              }
            }}
          >
            Continue
          </Link>
        </div>
      </section>
      <ReviewLesson
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
        isIkigaiLesson={isIkigaiLesson}
      />
    </div>
  );
};

const ReviewLesson = ({
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
  isIkigaiLesson = false,
}: {
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
  isIkigaiLesson?: boolean;
}) => {
  const [selectedQuestionResult, setSelectedQuestionResult] =
    useState<null | QuestionResult>(null);
  return (
    <div
      className={[
        "fixed inset-0 flex items-center justify-center p-5 transition duration-300",
        reviewLessonShown ? "" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-black",
          reviewLessonShown ? "opacity-75" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setReviewLessonShown(false)}
      ></div>
      <div className="relative flex w-full max-w-4xl flex-col gap-5 rounded-2xl border-2 border-gray-200 bg-white p-8">
        <button
          className="absolute -right-5 -top-5 rounded-full border-2 border-gray-200 bg-gray-100 p-1 text-gray-400 hover:brightness-90"
          onClick={() => setReviewLessonShown(false)}
        >
          <BigCloseSvg className="h-8 w-8" />
          <span className="sr-only">Close</span>
        </button>
        <h2 className="text-center text-3xl">
          {isIkigaiLesson ? "Vos Réponses IKIGAI" : "Your Wellness Insights"}
        </h2>
        <p className="text-center text-xl text-gray-400">
          {isIkigaiLesson 
            ? "Cliquez sur les cartes ci-dessous pour revoir vos réponses" 
            : "Click the tiles below to review your responses"}
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {questionResults.map((questionResult, i) => {
            const isCorrect = isIkigaiLesson || 
              questionResult.yourResponse === questionResult.correctResponse;

            return (
              <button
                key={i}
                className={[
                  "relative flex flex-col items-stretch gap-3 rounded-xl p-5 text-left",
                  isCorrect
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-500",
                ].join(" ")}
                onClick={() =>
                  setSelectedQuestionResult((selectedQuestionResult) =>
                    selectedQuestionResult === questionResult
                      ? null
                      : questionResult,
                  )
                }
              >
                <div className="flex justify-between gap-2">
                  <h3 className="font-bold">{questionResult.question}</h3>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
                    {isCorrect ? (
                      <DoneSvg className="h-5 w-5" />
                    ) : (
                      <BigCloseSvg className="h-5 w-5" />
                    )}
                  </div>
                </div>
                <div>{questionResult.yourResponse}</div>
                {selectedQuestionResult === questionResult && (
                  <div className="absolute left-1 right-1 top-20 z-10 rounded-2xl border-2 border-gray-200 bg-white p-3 text-sm tracking-tighter">
                    <div
                      className="absolute -top-2 h-3 w-3 rotate-45 border-l-2 border-t-2 border-gray-200 bg-white"
                      style={{ left: "calc(50% - 6px)" }}
                    ></div>
                    <div className="font-bold uppercase text-gray-400">
                      {isIkigaiLesson ? "Votre réponse :" : "Your response:"}
                    </div>
                    <div className="mb-3 text-gray-700">
                      {questionResult.yourResponse}
                    </div>
                    {!isIkigaiLesson && (
                      <>
                        <div className="font-bold uppercase text-gray-400">
                          Correct response:
                        </div>
                        <div className="text-gray-700">
                          {questionResult.correctResponse}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LessonFastForwardStart = ({
  unitNumber,
  setIsStartingLesson,
}: {
  unitNumber: number;
  setIsStartingLesson: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex min-h-screen flex-col px-5 py-8 text-center">
      <div className="flex grow flex-col items-center justify-center gap-5">
        <LessonFastForwardStartSvg />
        <h1 className="text-lg font-bold">
          Want to jump to Wellness Module {unitNumber}?
        </h1>
        <p className="text-sm text-gray-400">
          {`Pass the mindfulness test to jump ahead. Focus and be present!`}
        </p>
      </div>
      <div className="flex flex-col gap-5"></div>
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-5 sm:flex-row sm:justify-between">
          <Link
            href="/learn"
            className="font-bold uppercase text-blue-400 transition hover:brightness-110"
          >
            Maybe later
          </Link>
          <button
            className="w-full rounded-2xl border-b-4 border-blue-500 bg-blue-400 p-3 font-bold uppercase text-white transition hover:brightness-110 sm:min-w-[150px] sm:max-w-fit"
            onClick={() => setIsStartingLesson(false)}
          >
            {`I'm ready`}
          </button>
        </div>
      </section>
    </div>
  );
};

const LessonFastForwardEndFail = ({
  unitNumber,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
}: {
  unitNumber: number;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
}) => {
  return (
    <div className="flex min-h-screen flex-col px-5 py-8 text-center">
      <div className="flex grow flex-col items-center justify-center gap-5">
        <LessonFastForwardEndFailSvg />
        <h1 className="text-2xl font-bold">
          {`You didn't unlock Wellness Module ${unitNumber}`}
        </h1>
        <p className="text-lg text-gray-500">
          {`Remember that mindfulness is a journey. Let's continue practicing!`}
        </p>
      </div>
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl sm:justify-between">
          <button
            className="hidden rounded-2xl border-2 border-b-4 border-gray-200 bg-white p-3 font-bold uppercase text-gray-400 transition hover:border-gray-300 hover:bg-gray-200 sm:block sm:min-w-[150px] sm:max-w-fit"
            onClick={() => setReviewLessonShown(true)}
          >
            Review lesson
          </button>
          <Link
            className="flex w-full items-center justify-center rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit"
            href="/learn"
          >
            Continue
          </Link>
        </div>
      </section>
      <ReviewLesson
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    </div>
  );
};

const LessonFastForwardEndPass = ({
  unitNumber,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
}: {
  unitNumber: number;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
}) => {
  const jumpToUnit = useBoundStore((x) => x.jumpToUnit);
  return (
    <div className="flex min-h-screen flex-col px-5 py-8 text-center">
      <div className="flex grow flex-col items-center justify-center gap-5">
        <LessonFastForwardEndPassSvg />
        <h1 className="text-2xl font-bold">You unlocked Wellness Module {unitNumber}!</h1>
        <p className="text-lg text-gray-500">
          Wonderful progress on your wellbeing journey!
        </p>
      </div>
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl sm:justify-between">
          <button
            className="hidden rounded-2xl border-2 border-b-4 border-gray-200 bg-white p-3 font-bold uppercase text-gray-400 transition hover:border-gray-300 hover:bg-gray-200 sm:block sm:min-w-[150px] sm:max-w-fit"
            onClick={() => setReviewLessonShown(true)}
          >
            Review lesson
          </button>
          <Link
            className="flex w-full items-center justify-center rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit"
            href="/learn"
            onClick={() => jumpToUnit(unitNumber)}
          >
            Continue
          </Link>
        </div>
      </section>
      <ReviewLesson
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    </div>
  );
};