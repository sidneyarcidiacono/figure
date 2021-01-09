const isWithinInterval = require('date-fns/isWithinInterval')
const startOfToday = require('date-fns/startOfToday')
const sub = require('date-fns/sub')

const User = require('../models/user')
const Savings = require('../models/savings')

// TODO: Improve error handling

const filterByTimeFrame = (timeFrame, updatesList, startOfTimeFrameFunc, endOfTimeFrameFunc) => {
  // Take updates list and return a filtered list
  savings = updatesList.filter(i => {
    // isWithinInterval returns a boolean
    // Check if each item is within the interval (between the start and end dates provided)
    // Return if true
    return isWithinInterval(new Date(i.date), {
      start: startOfTimeFrameFunc(startOfToday()),
      end: endOfTimeFrameFunc(startOfToday())
    })
  })
  return new Promise((resolve, reject) => {
    savings ? resolve(savings) : reject('Failed to filter')
  })
}

// timeFrame is what we get from query params: month, week, year, quarter, or all.
// returnList is the empty list we create in our middleware and return to FE once filled
// interval relates to timeFrame. (ex: for year, we want data by month, so interval would be month.)

const filterSavingsData = async (user, startOfIntervalFunc, formatString, numOfDays) => {
  const returnList = []
  // {period:Date, amount:Number}
  Savings.aggregate([
    {
      $match: {
        userId: user._id
      }
    },
    { $unwind: { path: '$progressUpdates' } },
    { $group: { _id: { $dateToString: { format: formatString, date: '$progressUpdates.date' } }, amount: { $sum: '$progressUpdates.curTotal' }, date: { $first: '$progressUpdates.date' } } }
  ])
    .exec((err, result) => {
      if (err) {
        console.log(err)
      }
      if (result) {
        result.map(r => {
          if (isWithinInterval(new Date(r.date), {
            start: sub(startOfToday(), {
              days: numOfDays
            }),
            end: startOfToday()
          })) {
            returnList.push({ period: startOfIntervalFunc(r.date), amount: r.amount })
            console.log(`returnList from line 55 function call: ${returnList}`)
            return returnList
          }
        })
      }
    })
}

module.exports.filterSavingsData = filterSavingsData
module.exports.filterByTimeFrame = filterByTimeFrame
