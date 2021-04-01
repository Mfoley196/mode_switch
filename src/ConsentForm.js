import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ConsentForm = (props) => {
  const { onSubmit, ...rest } = props;

  let questions = [
    {
      label:
        'I agree to allow audio/video clips and images in which I appear to be used in teaching, scientific presentations, publication and/or datasets with the understanding that I will not be identified by name.',
      required: false,
    },
    {
      label:
        'If the audio/video clip or image is used where my face, voice, or other identifying features are recognizable, please alter the tone and pitch of the audio and/or obscuring my identity in the video or images.',
      required: false,
    },
    {
      label: 'I agree of my own free will to participate in the study. **REQUIRED**',
      required: true,
    },
  ];

  let initialState = {
    'I agree to allow audio/video clips and images in which I appear to be used in teaching, scientific presentations, publication and/or datasets with the understanding that I will not be identified by name.': false,
    'If the audio/video clip or image is used where my face, voice, or other identifying features are recognizable, please alter the tone and pitch of the audio and/or obscuring my identity in the video or images.': false,
    'I agree of my own free will to participate in the study.': false,
  };

  const [questionsChecked, setChecked] = useState(initialState);

  const handleChange = (event) => {
    setChecked({
      ...questionsChecked,
      [event.target.id]: event.target.checked,
    });
  };

  function requiredFieldNotFilled() {
    let requiredNotFilled = questions.map((question) =>
      question.required ? !questionsChecked[question.label] : true,
    );

    return !requiredNotFilled.some((val) => !val);
  }

  function handleClick() {
    console.log(questionsChecked);
    if (!requiredFieldNotFilled()) {
      onSubmit();
    } else {
      alert("You must check the required checkboxes to proceed.")
    }
  }

  return (
    <div>
      <p>insert placeholder text until I get ORE wording</p>

      <Form>
        {questions.map((question) => {
          return (
            <Form.Check
              id={question.label}
              key={question.label}
              type="checkbox"
              label={question.label}
              required={question.required}
              onChange={handleChange}
            />
          );
        })}

        <Button onClick={handleClick} variant="outline-success">
          I Agree
        </Button>
      </Form>
    </div>
  );
};

export default ConsentForm;
