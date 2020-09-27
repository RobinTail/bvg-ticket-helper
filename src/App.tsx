import 'semantic-ui-css/semantic.min.css'
import * as React from 'react';
import {useMemo, useState} from 'react';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import Accordion from 'semantic-ui-react/dist/commonjs/modules/Accordion';
import {suggestTickets} from './lib/suggestion';
import {Answers, QuestionCode, questions} from './lib/questions';
import styled from 'styled-components';

const HolderWithMargins = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 20px 0;
`;

const getRelevantQuestions = (choices: Answers) => {
  return questions.filter((question) => question.isRelevant(choices));
}

function App() {
  const [name, setName] = useState('');
  const [isNameAccepted, setIsNameAccepted] = useState(false);
  const [nameError, setNameError] = useState(undefined as string | undefined);
  const [activeQuestionIndex, setQuestionIndex] = useState(0);
  const [choices, setChoices] = useState({} as Answers);
  const relevantQuestions = useMemo(() => getRelevantQuestions(choices), [choices]);
  const suggestions = useMemo(() => {
    if (activeQuestionIndex > relevantQuestions.length - 1) {
      return suggestTickets(choices);
    }
    return [];
  }, [activeQuestionIndex, relevantQuestions, choices])
  const isDone = suggestions.length > 0;

  const handleChoiceClick = (questionCode: QuestionCode, optionCode: string) => {
    const newChoices = {
      ...choices,
      [questionCode]: optionCode
    };
    setChoices(newChoices);
    setQuestionIndex(activeQuestionIndex + 1);
  }

  const handleRestartClick = () => {
    setIsNameAccepted(false);
    setChoices({});
    setName('');
    setNameError(undefined);
    setQuestionIndex(0);
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const handleAcceptName = () => {
    if (name.trim().length > 0) {
      setIsNameAccepted(true);
      setNameError(undefined);
    } else {
      setNameError('Your name is required');
    }
  }

  const nameInputForm = (
    <Segment>
      <Form>
        <Form.Input
          fluid
          label='Enter your name'
          error={nameError}
          value={name}
          onChange={handleNameChange}
        />
        <Button primary onClick={handleAcceptName}>Continue</Button>
      </Form>
    </Segment>
  );

  const questionsWizard = (
    <Accordion exclusive styled={!isDone} fluid>
      {relevantQuestions.map((question, index) => (
        <React.Fragment key={index}>
          <Accordion.Title active={activeQuestionIndex === index || isDone}>
            {question.title}
          </Accordion.Title>
          <Accordion.Content active={activeQuestionIndex === index || isDone}>
            {question.description && !isDone ? (
              <p><em>{question.description}</em></p>
            ) : null}
            {question.options.map((option) => (
              <Button
                key={option.code}
                onClick={() => handleChoiceClick(question.code, option.code)}
                primary={choices[question.code] === option.code}
                disabled={isDone}
              >
                {option.title}
              </Button>
            ))}
          </Accordion.Content>
        </React.Fragment>
      ))}
    </Accordion>
  );

  const suggestionMessage = isDone && (
    <Message positive icon>
      <Icon name='idea'/>
      <Message.Content>
        <Message.Header>Suggestion</Message.Header>
        <p>I advise you to purchase the following tickets, {name}:</p>
        {suggestions.map(({quantity, title, price}, index) => (
          <Label.Group key={index}>
            <Label basic pointing='right'>
              {`${quantity} × `}
            </Label>
            <Label color='brown' size='large'>
              <Icon name='ticket alternate'/>
              {title}
            </Label>
            <Label tag color='yellow' size='large'>
              {price.toFixed(2)} €
            </Label>
          </Label.Group>
        ))}
        {suggestions.length > 1 || suggestions[0].quantity > 1 ? (
          <p>Total: {
            suggestions
              .reduce((total, {price, quantity}) => total + price * quantity, 0)
              .toFixed(2)
          } €</p>
        ) : null}
        <p><em>Your answers are shown below. Click Restart to repeat.</em></p>
      </Message.Content>
    </Message>
  );

  return (
    <Container text>
      <Header size='huge' textAlign='center'>
        <Header.Content>BVG Ticket Helper for Berlin Visitors</Header.Content>
        <Header.Subheader>
          A lot of people come to Berlin <em>for short trips and holiday</em>. They often don’t know how to decide what
          ticket to get in order to use the city’s public transport. There are several ticket options based on the
          amount of stations per trip, how much time the person is staying in the city, their age and so on.
        </Header.Subheader>
      </Header>

      <HolderWithMargins>
        <Button negative onClick={handleRestartClick}>Restart</Button>
      </HolderWithMargins>

      {isDone && suggestionMessage}
      {isNameAccepted ? questionsWizard : nameInputForm}

    </Container>
  );
}

export default App;
