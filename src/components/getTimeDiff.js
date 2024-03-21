import React from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

function getTimeDiff(timeToCompare) {
    const timeDiffDuration = dayjs.duration(dayjs().diff(timeToCompare))
    const yearDiff = parseInt(timeDiffDuration.format('Y'))
    const monthDiff = parseInt(timeDiffDuration.format('M'))
    const dateDiff = parseInt(timeDiffDuration.format('D'))
    const hourDiff = parseInt(timeDiffDuration.format('H'))
    const minuteDiff = parseInt(timeDiffDuration.format('m'))
    const secondDiff = parseInt(timeDiffDuration.format('s'))

    if (yearDiff > 0) {
        return `${yearDiff}년 전`
    } else if (monthDiff > 0) {
        return `${monthDiff}달 전`
    } else if (dateDiff > 0) {
        return `${dateDiff}일 전`
    } else if (hourDiff > 0) {
        return `${hourDiff}시간 전`
    } else if (minuteDiff > 0) {
        return `${minuteDiff}분 전`
    } else if (secondDiff > 0) {
        return `${secondDiff}초 전`
    } else {
        return ''
    }
}

export default getTimeDiff