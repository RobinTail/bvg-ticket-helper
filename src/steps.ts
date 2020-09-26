interface Option {
  code: string;
  title: string;
}

const stepCodes = {
  time: true,
  quantity: true,
  isShort: true,
  isRural: true,
  hasDiscount: true
}

export type StepCode = keyof typeof stepCodes;

interface Step {
  code: StepCode;
  title: string;
  description?: string;
  options: Option[];
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

export const steps: Step[] = [
  {
    code: 'time',
    title: 'How much time are you planning on staying in the city?',
    options: timeOptions
  },
  {
    code: 'quantity',
    title: 'How much rides are you going to have in a day?',
    options: quantityOptions
  },
  {
    code: 'isShort',
    title: 'Are your rides going to be short?',
    description: '3 stops on a train or 6 stops on a bus',
    options: booleanOptions
  },
  {
    code: 'isRural',
    title: 'Are you going to visit rural districts surrounding Berlin?',
    options: booleanOptions
  },
  {
    code: 'hasDiscount',
    title: 'Are you under 14 years old?',
    options: booleanOptions
  }
];

export type Choices = {[K in StepCode]: string};
