interface Option {
  code: string;
  title: string;
}

const questionCodes = {
  time: true,
  quantity: true,
  isShort: true,
  isRural: true,
  hasDiscount: true,
  isGroup: true
}

export type QuestionCode = keyof typeof questionCodes;

type RelevanceChecker = (answers: Answers) => boolean;

interface Question {
  code: QuestionCode;
  title: string;
  description?: string;
  options: Option[];
  isRelevant: RelevanceChecker;
}

const booleanOptions: Option[] = [
  {
    code: 'yes',
    title: 'Yes'
  },
  {
    code: 'no',
    title: 'No'
  }
];

const timeOptions: Option[] = [1,2,3].map((duration) => ({
  code: `${duration}`,
  title: `${duration} day${duration > 1 ? 's' : ''}`
}));

const quantityTexts: string[] = ['One', 'Two', 'Three', 'Four'];
const quantityOptions: Option[] = [1,2,3,4].map((quantity) => ({
  code: `${quantity}`,
  title: quantityTexts[quantity - 1]
})).concat([{
  code: 'more',
  title: 'More'
}]);

const alwaysRelevant: RelevanceChecker = () => true;

export const questions: Question[] = [
  {
    code: 'time',
    title: 'How much time are you planning on staying in the city?',
    options: timeOptions,
    isRelevant: alwaysRelevant
  },
  {
    code: 'quantity',
    title: 'How much rides are you going to have in a day?',
    options: quantityOptions,
    isRelevant: alwaysRelevant
  },
  {
    code: 'isGroup',
    title: 'Are you traveling in a group of 3—5 people?',
    options: booleanOptions,
    isRelevant: (answers) => { // only relevant for day tickets
      return answers.quantity === 'more';
    }
  },
  {
    code: 'isShort',
    title: 'Are your rides going to be short?',
    description: '3 stops on a train or 6 stops on a bus',
    options: booleanOptions,
    isRelevant: (answers) => { // not relevant for day tickets
      return answers.quantity !== 'more';
    }
  },
  {
    code: 'isRural',
    title: 'Are you going to visit rural districts surrounding Berlin?',
    options: booleanOptions,
    isRelevant: (answers) => { // not relevant for short tickets
      return !(answers.quantity !== 'more' && answers.isShort === 'yes');
    }
  },
  {
    code: 'hasDiscount',
    title: 'Are you under 14 years old?',
    options: booleanOptions,
    isRelevant: (answers) => { // not relevant for groups
      return answers.isGroup !== 'yes';
    }
  }
];

export type Answers = {[K in QuestionCode]?: string};
