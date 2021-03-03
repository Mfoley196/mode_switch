import React from 'react'

const InfoForm = (props) => {
  const { goToStage, pNo, setPNo } = props

  const handleSubmit = (evt) => {
    evt.preventDefault()
    goToStage({ type: 'instruction' })
    console.log(pNo)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Participant Number:
        <input type="text" onChange={(e) => setPNo(e.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default InfoForm
