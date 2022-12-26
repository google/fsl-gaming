// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// TODO: High-level file comment.

const logger = require('../FSL-Backend-Common/utils/logger');
const { URLS, TOTAL_OVER_COUNT, TOTAL_WICKET_COUNT, POWERPLAY_OVER_COUNT, BOWLER_OVER_COUNT, RUN_BUCKET } = require('../FSL-Backend-Common/config/constants');
const { runSelect } = require('../FSL-Backend-Common/database/spanner');
const axios = require('axios').default;

module.exports = class SimulateInn {

    currentBallCount = 0;
    extraBallCount = 0
    currentOverCount = 0;
    currentWktCount = 0;
    currentTotalScore = 0;
    currentInnings = 0;
    innings_count = 0;
    isPowerplay = true;
    onCreaseBatsman = '';
    offCreaseBatsman = '';
    lastBowler = '';
    currentBowler = '';
    innings_batting = {}
    innings_bowling = {}
    innings1_batting
    innings1_bowling
    innings2_batting
    innings2_bowling
    availableBatters
    firstInningsScore
    matchUuid

    constructor(ininngs1_batting, innings1_bowling, inninngs2_batting, innings2_bowling, match_id) {
        this.matchUuid = match_id
        this.innings1_batting = ininngs1_batting
        this.innings1_bowling = innings1_bowling
        this.innings2_batting = inninngs2_batting
        this.innings2_bowling = innings2_bowling
        this.innings_count = 1
        this.innings_batting = ininngs1_batting
        this.innings_bowling = innings1_bowling
        this.availableBatters = Object.keys(this.innings_batting).reverse()
        this.offCreaseBatsman = this.selectBatter()
        this.onCreaseBatsman = this.selectBatter()
        this.currentBowler = this.selectBowler()
    }

    resetConsts() {
        this.availableBatters = []
        this.offCreaseBatsman = ''
        this.onCreaseBatsman = ''
        this.innings_batting = {}
        this.innings_bowling = {}
        this.currentBallCount = 0;
        this.extraBallCount = 0
        this.currentOverCount = 0;
        this.currentWktCount = 0;
        this.currentTotalScore = 0;
    }

    checkInnings() {
        if (this.innings_count == 1) {
            this.firstInningsScore = this.currentTotalScore
            this.resetConsts()
            this.innings_batting = this.innings2_batting
            this.innings_bowling = this.innings2_bowling
            this.availableBatters = Object.keys(this.innings_batting).reverse()
            this.offCreaseBatsman = this.selectBatter()
            this.onCreaseBatsman = this.selectBatter()
            this.currentBowler = this.selectBowler()
            this.innings_count = 2
            return true
        }
        return false
    }

    swapOncreasePlayer() {
        var temp = this.onCreaseBatsman
        this.onCreaseBatsman = this.offCreaseBatsman
        this.offCreaseBatsman = temp
    }

    selectBowler() {
        let availableBowlers = []
        Object.keys(this.innings_bowling).forEach(player => {
            if (this.innings_bowling[player]['oversBowled'] < BOWLER_OVER_COUNT && (!this.lastBowler || this.lastBowler != this.innings_bowling[player]['playerUuid'])) {
                availableBowlers.push(player)
            }
        })

        var bowler = availableBowlers[Math.floor(Math.random() * availableBowlers.length)];
        this.innings_bowling[bowler][`oversBowled`] += 1
        this.lastBowler = bowler
        return bowler
    }

    selectBatter() {
        return this.availableBatters.pop()
    }

    simulateInnings() {
        var relay = setInterval(async () => {
            if (this.currentOverCount == TOTAL_OVER_COUNT || this.currentWktCount == TOTAL_WICKET_COUNT || (this.firstInningsScore != 0 && this.currentTotalScore > this.firstInningsScore)) {
                if (!this.checkInnings()) {
                    clearInterval(relay)
                    logger.info({ 'message': 'Match Completed' })
                    if (this.firstInningsScore > this.currentTotalScore)
                        logger.info({ 'message': 'Team batted first won the match' })
                    else if (this.firstInningsScore == this.currentTotalScore)
                        logger.info({ 'message': 'Match Tie!' })
                    else
                        logger.info({ 'message': 'Team batted Second won the match' })

                    setTimeout(async () => {
                        let contestIds = await runSelect("SELECT contestUuid from ContestDetails WHERE matchUuid=@matchUuid", {
                            'matchUuid': this.matchUuid
                        }).catch((error) =>{
                            logger.error({
                                error,
                                methodCalled:"Select"
                            })
                          })

                        contestIds.forEach(async (contestId) => {
                            //get leaderboard 
                            let { data } = await axios.get(`${URLS[process.env.NODE_ENV]['display-leaderboard']}/contest-leaderboard/${contestId['contestUuid']}`).catch((error) =>{
                                logger.error({
                                    error,
                                    apiCalled:"getContestLeaderBoard"
                                })
                              });

                            let winnerList = data['data']['leaderBoard'];
                            //UpdateWinner List
                            let dataPacket = {
                                'contestId': contestId['contestUuid'],
                                'results': winnerList.slice(0, 10)
                            }
                            axios.post(`${URLS[process.env.NODE_ENV]['resource-management']}/winnerslist`, dataPacket)
                            .catch((error) =>{
                                logger.error({
                                    error,
                                    apiCalled:"MatchResult"
                                })
                              });
                            logger.info({ 'message': `Contest Details Updated for contestUuid ${contestId['contestUuid']}` })
                        })
                    }, 120 * 1000)
                    const startTime = Date.now();
                    await axios.post(`${URLS[process.env.NODE_ENV]['resource-management']}/match-result`,{
                        "matchUuid": this.matchUuid
                      }).catch((error) =>{
                        logger.error({
                            error,
                            apiCalled:"MatchResult"
                        })
                      })
                      logger.info({
                          matchUuid: this.matchUuid,
                          responseTime: Date.now() - startTime,
                          apiCalled: "MatchResult",
                      });
                    return true
                }
                
            }
            let resObj = {}
            let ball
            let run

            if (this.currentOverCount == POWERPLAY_OVER_COUNT) {
                this.isPowerplay = false
            }
            if (this.isPowerplay) {
                ball = RUN_BUCKET.POWERPLAY_BUCKET[Math.floor(Math.random() * RUN_BUCKET.POWERPLAY_BUCKET.length)];
                run = RUN_BUCKET[ball + '_BUCKET'][Math.floor(Math.random() * RUN_BUCKET[ball + '_BUCKET'].length)];
            }
            else {
                ball = RUN_BUCKET.NON_POWERPLAY_BUCKET[Math.floor(Math.random() * RUN_BUCKET.NON_POWERPLAY_BUCKET.length)];
                run = RUN_BUCKET[ball + '_BUCKET'][Math.floor(Math.random() * RUN_BUCKET[ball + '_BUCKET'].length)];
            }
            resObj['matchUuid'] = this.matchUuid
            resObj['onCreaseBatsman'] = this.onCreaseBatsman
            resObj['offCreaseBatsman'] = this.offCreaseBatsman
            resObj['currentBolwer'] = this.currentBowler
            resObj['ball'] = ball;
            resObj['run'] = run;

            switch (ball) {
                case 'EXTRA':
                    resObj['isGoodBall'] = false;
                    this.currentTotalScore += 1;
                    this.extraBallCount += 1;
                    this.currentBallCount += 1
                    resObj['ballCount'] = this.currentBallCount
                    resObj['OverCount'] = this.currentOverCount
                    resObj['extraType'] = run
                    break;
                case 'WICKET':
                    if ((run == 'CAUGHT' || run == 'LBW' || run == 'BOWLED' || run == 'STUMPED')) {
                        resObj['onCreaseBatsmanOut'] = true;
                        this.onCreaseBatsman = this.selectBatter()
                    } else {
                        resObj['onCreaseBatsmanOut'] = false;
                        this.offCreaseBatsman = this.selectBatter()
                    }
                    this.currentBallCount += 1
                    resObj['isWicketFallen'] = true;
                    resObj['isGoodBall'] = true;
                    resObj['bowler'] = this.currentBowler
                    resObj['ballCount'] = this.currentBallCount
                    resObj['OverCount'] = this.currentOverCount
                    this.currentWktCount += 1
                    resObj['wicketType'] = run;
                    break;
                case 'BOUNDARY':
                    this.currentBallCount += 1
                    resObj['isBoundary'] = true;
                    resObj['isGoodBall'] = true;
                    resObj['ballCount'] = this.currentBallCount
                    resObj['OverCount'] = this.currentOverCount
                    this.innings_batting[this.onCreaseBatsman]['score'] += run
                    this.currentTotalScore += run;
                    break;
                default:
                    this.currentBallCount += 1
                    resObj['isGoodBall'] = true;
                    resObj['ballCount'] = this.currentBallCount
                    resObj['OverCount'] = this.currentOverCount
                    if (typeof (run) == 'number') {
                        if (run % 2 == 0) {
                            this.innings_batting[this.onCreaseBatsman]['score'] += run
                        }
                        else {
                            this.innings_batting[this.onCreaseBatsman]['score'] += run
                            this.swapOncreasePlayer()
                        }
                    }
                    this.currentTotalScore += run;
                    break;
            }
            if ((this.currentBallCount - this.extraBallCount) % 6 == 0 && (this.currentBallCount - this.extraBallCount) != 0) {
                this.swapOncreasePlayer()
                this.currentBallCount = 0
                this.currentOverCount += 1
                this.extraBallCount = 0
                this.currentBowler = this.selectBowler()

                logger.info({
                    'message': `${this.currentOverCount} Over Completed`
                })
            }
            logger.info({
                'message': `${this.currentTotalScore} / ${this.currentWktCount} for ${this.currentOverCount}.${this.currentBallCount - this.extraBallCount} of Innings ${this.innings_count}`
            })
            // Call simulateBall API
            axios.post(`${URLS[process.env.NODE_ENV]['simulator']}/simulte-ball`, resObj).catch(error =>{
                logger.error(error, { message: 'simulateBall' })
            });
            return true

        }, 10 * 1000)
    }


}
