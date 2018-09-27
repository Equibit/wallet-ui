import feathersClient from '../feathers-client'
const questions = [{
  question: 'What best describes your interest in Equibit?',
  questionType: 'SINGLE',
  sortIndex: 1,
  answerOptions: [
    {
      answer: 'I just want the free EQB for completing this questionnaire <strong>[end]</strong>',
      finalQuestion: true
    },
    { answer: 'I’m interested in both investing and raising money for companies on the blockchain' },
    { answer: 'I’m only interested in using Equibit Portfolio to invest in companies' },
    {
      answer: 'I’m only interested in using Equibit Portfolio to raise money for companies <strong>[Goto Q8]</strong>',
      skipTo: 8
    }
  ]
},
{
  question: 'How likely are you to use Equibit Portfolio to invest in a company?',
  questionType: 'SINGLE',
  sortIndex: 2,
  answerOptions: [
    {
      answer: 'Unlikely <strong>[end]</strong>',
      finalQuestion: true
    },
    { answer: 'Somewhat likely' },
    { answer: 'Very likely' },
    { answer: 'Don’t know' }
  ]
},
{
  question: 'What types of companies are you most interested investing in?',
  questionType: 'MULTI',
  sortIndex: 3,
  answerOptions: [
    {
      answer: 'Blockchain',
      finalQuestion: true
    },
    { answer: 'Fintech' },
    { answer: 'Cannabis' },
    { answer: 'Any Start-up' },
    { answer: 'Traditional/Blue chip' },
    { answer: 'Any' },
    { answer: 'Don\'t know' }
  ]
},
{
  question: 'Are you an “Accredited Investor? That is; do you earn more than $250,000 (USD)/year or have over $1,000,000 USD in liquid Assets or have a net worth of over $5,000,000',
  questionType: 'SINGLE',
  sortIndex: 4,
  answerOptions: [
    { answer: 'Yes' },
    { answer: 'No' }
  ]
},
{
  question: 'What is the current approximate size of your investment portfolio (Both crypto and other)?',
  questionType: 'SINGLE',
  sortIndex: 5,
  answerOptions: [
    { answer: 'Let than one BTC' },
    { answer: 'Between 1 and 10 BTC' },
    { answer: 'More than 10 BYTC but less than 100 BTC' },
    { answer: 'More than 100 BTC' }
  ]
},
{
  question: 'How would you describe your blockchain investment strategy?',
  questionType: 'MULTI',
  sortIndex: 6,
  answerOptions: [
    { answer: 'I buy and sell crypto currencies (ICOs and aftermarket)' },
    { answer: 'I buy and sell equity (shares) in crypto related business' },
    { answer: 'I look forward to using the EQB network and tools to invest in all manner of companies.' }
  ]
},
{
  question: 'What features are important to you while selecting equities or assets for your portfolio?',
  questionType: 'SINGLE',
  sortIndex: 7,
  answerOptions: [
    { answer: 'Voting Rights (an investor Voice)' },
    { answer: 'Capital Gains (asset appreciation)' },
    { answer: 'Dividends' },
    { answer: 'Diversity' },
    { answer: 'CUSTOM' },
    { answer: 'Don’t know' }
  ]
},
{
  question: 'What language(s )are you most comfortable using or conducting business in?',
  questionType: 'MULTI',
  sortIndex: 8,
  answerOptions: [
    { answer: 'English' },
    { answer: 'Simplified Chinese' },
    { answer: 'French' },
    { answer: 'Spanish' },
    { answer: 'Hindi' },
    { answer: 'Korean' },
    { answer: 'CUSTOM' }
  ]
},
{
  question: 'What geographic regions (based on corporate head office address) are you interested in?',
  questionType: 'SINGLE',
  sortIndex: 9,
  answerOptions: [
    { answer: 'North America' },
    { answer: 'Europe' },
    { answer: 'Asia' },
    { answer: 'South America' },
    { answer: 'Australia' },
    { answer: 'Africa' }
  ]
},
{
  question: 'What county do you consider home?',
  questionType: 'DROPDOWN',
  sortIndex: 10,
  answerOptions: [
    { answer: 'COUNTRIES' }
  ]
}]

const questionnaire = {
  description: 'sample quiz',
  isActive: true,
  questions,
  reward: 10,
  status: 'active'
}

feathersClient.service('portfolios').patch = () => Promise.resolve()

export default questionnaire
