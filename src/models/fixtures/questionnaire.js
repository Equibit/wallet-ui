import fixture from 'can-fixture'
import mockQuestionnaire from '~/models/mock/mock-questionnaire'

fixture('GET /questionnaire', function () {
  console.log('/questionnaire mock called')
  return [mockQuestionnaire]
})
fixture('GET /questionnaire/{id}', function () {
  console.log('/questionnaire/{id} mock called')
  return mockQuestionnaire
})
