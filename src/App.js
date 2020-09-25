import React, {useState} from 'react';
import 'semantic-ui-css/semantic.min.css'
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import Accordion from 'semantic-ui-react/dist/commonjs/modules/Accordion';
import suggestTickets from './logic';
import {steps} from './steps';
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
  const [nameError, setNameError] = useState(undefined);
  const [activeStepIndex, setStep] = useState(0);
  const [choices, setChoices] = useState({});
  const [isDone, setIsDone] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleChoiceClick = (stepCode, optionCode) => {
    const newChoices = {
      ...choices,
      [stepCode]: optionCode
    };
    setChoices(newChoices);
    if (activeStepIndex === steps.length - 1) {
      setSuggestions(suggestTickets(newChoices));
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

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleAcceptName = () => {
    if (name.trim().length > 0) {
      setIsNameAccepted(true);
      setNameError(null);
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
                onClick={handleChoiceClick.bind(this, step.code, option.code)}
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

  const decisionNotice = suggestions && (
    <Message positive icon>
      <Icon name='idea'/>
      <Message.Content>
        <Message.Header>Decision</Message.Header>
        <p>I advise you to purchase the following tickets, {name}:</p>
        {suggestions.map(({quantity, title, price}) => (
          <Label.Group>
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
        {suggestions.length > 1 ? (
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
        <Header.Content>BVG Ticket Helper</Header.Content>
        <Header.Subheader>for short trips and holidays</Header.Subheader>
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
