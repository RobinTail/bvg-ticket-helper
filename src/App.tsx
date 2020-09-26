import 'semantic-ui-css/semantic.min.css'
import * as React from 'react';
import {useState} from 'react';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import Accordion from 'semantic-ui-react/dist/commonjs/modules/Accordion';
import {suggestTickets, Suggestion} from './logic';
import {Choices, StepCode, steps} from './steps';
import styled from 'styled-components';

const HolderWithMargins = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 20px 0;
`;

function App() {
  const [name, setName] = useState('');
  const [isNameAccepted, setIsNameAccepted] = useState(false);
  const [nameError, setNameError] = useState(undefined as string | undefined);
  const [activeStepIndex, setStep] = useState(0);
  const [choices, setChoices] = useState({} as Partial<Choices>);
  const [isDone, setIsDone] = useState(false);
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);

  const handleChoiceClick = (stepCode: StepCode, optionCode: string) => {
    const newChoices = {
      ...choices,
      [stepCode]: optionCode
    };
    setChoices(newChoices);
    if (activeStepIndex === steps.length - 1) {
      setSuggestions(suggestTickets(newChoices as Choices));
      setIsDone(true);
    } else {
      setStep(activeStepIndex + 1);
    }
  }

  const handleRestartClick = () => {
    setIsDone(false);
    setIsNameAccepted(false);
    setChoices({});
    setName('');
    setNameError(undefined);
    setStep(0);
    setSuggestions([]);
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
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <Accordion.Title active={activeStepIndex === index || isDone}>
            {step.title}
          </Accordion.Title>
          <Accordion.Content active={activeStepIndex === index || isDone}>
            {step.description && !isDone ? (
              <p><em>{step.description}</em></p>
            ) : null}
            {step.options.map((option) => (
              <Button
                key={option.code}
                onClick={() => handleChoiceClick(step.code, option.code)}
                primary={choices[step.code] === option.code}
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

  const decisionNotice = (suggestions.length > 0) && (
    <Message positive icon>
      <Icon name='idea'/>
      <Message.Content>
        <Message.Header>Decision</Message.Header>
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

      {isDone && decisionNotice}
      {isNameAccepted ? questionsWizard : nameInputForm}

    </Container>
  );
}

export default App;
