CREATE TABLE ContestDetails (
CREATE TABLE ContestDetails (
  contestUuid STRING(36) NOT NULL,
  matchUuid STRING(36),
  team1Uuid STRING(36),
  team2Uuid STRING(36),
  slot INT64,
  winnerTeamUuid STRING(36),
  contestStatus STRING(20),
  results JSON,
  createdTS TIMESTAMP,
  lastUpdatedTS TIMESTAMP,
) PRIMARY KEY(contestUuid);

CREATE INDEX contest_matchUuid ON ContestDetails(matchUuid);

CREATE TABLE ContestLeaderboard (
  contestLeaderUuid STRING(36) NOT NULL,
  contestUuid STRING(36) NOT NULL,
  matchUuid STRING(36) NOT NULL,
  playerUuid STRING(36) NOT NULL,
  fantasyTeamUuid STRING(36) NOT NULL,
  isCaptain BOOL,
  isVCaptain BOOL,
  ball_count INT64,
  points FLOAT64,
  contestStatus STRING(20),
  createdTS TIMESTAMP,
  lastUpdatedTS TIMESTAMP,
  CONSTRAINT FK_CL_Contest_Details FOREIGN KEY(contestUuid) REFERENCES ContestDetails(contestUuid),
) PRIMARY KEY(contestLeaderUuid);

CREATE INDEX ContestLeaderboard_matchId ON ContestLeaderboard(matchUuid);

CREATE INDEX ContestLeaderboard_playerId ON ContestLeaderboard(playerUuid);

CREATE TABLE FantasyTeamDetails (
  fantasyTeamUuid STRING(36),
  userUuid STRING(36),
  contestUuid STRING(36),
  team1Uuid STRING(36),
  team2Uuid STRING(36),
  createdTS TIMESTAMP,
  lastUpdatedTS TIMESTAMP,
  CONSTRAINT FK_Contest_Details FOREIGN KEY(contestUuid) REFERENCES ContestDetails(contestUuid),
) PRIMARY KEY(fantasyTeamUuid);

ALTER TABLE ContestLeaderboard ADD CONSTRAINT FK_CL_Fantasy_Details FOREIGN KEY(fantasyTeamUuid) REFERENCES FantasyTeamDetails(fantasyTeamUuid);

CREATE INDEX FantasyTeamDetails_contestUuid ON FantasyTeamDetails(contestUuid);

CREATE TABLE FantasyTeamSquadDetails (
  fantasyTeamUuid STRING(36),
  fantasyTeamSquadUuid STRING(36) NOT NULL,
  playerUuid STRING(36) NOT NULL,
  createdTS TIMESTAMP,
  lastUpdatedTS TIMESTAMP,
  isCaptain BOOL,
  isVCaptain BOOL,
) PRIMARY KEY(fantasyTeamUuid, fantasyTeamSquadUuid),
  INTERLEAVE IN PARENT FantasyTeamDetails ON DELETE CASCADE;

CREATE TABLE MatchDetails (
  matchUuid STRING(36) NOT NULL,
  team1Uuid STRING(36) NOT NULL,
  team2Uuid STRING(36) NOT NULL,
  matchTime TIMESTAMP,
  matchStatus STRING(20),
  createdTS TIMESTAMP,
  lastUpdatedTS TIMESTAMP,
) PRIMARY KEY(matchUuid);

ALTER TABLE ContestDetails ADD CONSTRAINT FK_Match_Details_1 FOREIGN KEY(matchUuid) REFERENCES MatchDetails(matchUuid);

ALTER TABLE ContestDetails ADD CONSTRAINT FK_Winner_Details FOREIGN KEY(matchUuid) REFERENCES MatchDetails(matchUuid);

CREATE TABLE MatchResults (
  matchResultsUuid STRING(120) NOT NULL,
  matchUuid STRING(120) NOT NULL,
  contestUuid STRING(120) NOT NULL,
  fantasyTeamUuid STRING(120) NOT NULL,
  fantasyTeamScore FLOAT64,
  createdTS TIMESTAMP,
  CONSTRAINT FK_MR_Contest_Details FOREIGN KEY(contestUuid) REFERENCES ContestDetails(contestUuid),
  CONSTRAINT FK_MR_Fantasy_Details FOREIGN KEY(fantasyTeamUuid) REFERENCES FantasyTeamDetails(fantasyTeamUuid),
  CONSTRAINT FK_MR_Match_Details FOREIGN KEY(matchUuid) REFERENCES MatchDetails(matchUuid),
) PRIMARY KEY(matchResultsUuid);

CREATE TABLE MatchTimeline (
  matchTimelineUuid STRING(36) NOT NULL,
  matchUuid STRING(36) NOT NULL,
  batsmanUuid STRING(36),
  bowlerUuid STRING(36),
  over_count INT64,
  ball_count INT64,
  score INT64,
  hasLostWicket BOOL DEFAULT (FALSE),
  batsmanOutUuid STRING(36) DEFAULT (NULL),
  wicketType STRING(50),
  hasExtra BOOL DEFAULT (FALSE),
  extraType STRING(50),
  createdTS TIMESTAMP,
  CONSTRAINT FK_MT_Match_Details FOREIGN KEY(matchUuid) REFERENCES MatchDetails(matchUuid),
) PRIMARY KEY(matchTimelineUuid);

CREATE TABLE PlayerDetails (
  playerUuid STRING(36) NOT NULL,
  teamUuid STRING(36) NOT NULL,
  playerName STRING(36),
  credit FLOAT64,
  category STRING(50),
  createdTS TIMESTAMP,
  lastUpdatedTS TIMESTAMP,
) PRIMARY KEY(playerUuid);

ALTER TABLE MatchTimeline ADD CONSTRAINT FK_Batsman_Details FOREIGN KEY(batsmanUuid) REFERENCES PlayerDetails(playerUuid);

ALTER TABLE MatchTimeline ADD CONSTRAINT FK_Bowler_Details FOREIGN KEY(bowlerUuid) REFERENCES PlayerDetails(playerUuid);

ALTER TABLE ContestLeaderboard ADD CONSTRAINT FK_CL_Player_Details FOREIGN KEY(playerUuid) REFERENCES PlayerDetails(playerUuid);

CREATE TABLE PlayerLeaderboard (
  playerLeaderboardUuid STRING(36) NOT NULL,
  playerUuid STRING(36),
  matchUuid STRING(36),
  points FLOAT64,
  createdTS TIMESTAMP,
  lastUpdatedTS TIMESTAMP,
  CONSTRAINT FK_Match_Details FOREIGN KEY(matchUuid) REFERENCES MatchDetails(matchUuid),
  CONSTRAINT FK_Player_Details FOREIGN KEY(playerUuid) REFERENCES PlayerDetails(playerUuid),
) PRIMARY KEY(playerLeaderboardUuid);

CREATE TABLE TeamDetails (
  teamUuid STRING(36) NOT NULL,
  teamName STRING(50),
  availablePlayers INT64,
  createdTS TIMESTAMP,
  lastUpdatedTS TIMESTAMP,
) PRIMARY KEY(teamUuid);

ALTER TABLE MatchDetails ADD CONSTRAINT FK_Team_1_Details FOREIGN KEY(team1Uuid) REFERENCES TeamDetails(teamUuid);

ALTER TABLE MatchDetails ADD CONSTRAINT FK_Team_2_Details FOREIGN KEY(team2Uuid) REFERENCES TeamDetails(teamUuid);

ALTER TABLE PlayerDetails ADD CONSTRAINT FK_Team_Details FOREIGN KEY(teamUuid) REFERENCES TeamDetails(teamUuid);

CREATE TABLE UserDetails (
  userUuid STRING(36) NOT NULL,
  mobileNumber STRING(13),
  role STRING(10),
  createdTS TIMESTAMP,
  lastUpdatedTS TIMESTAMP,
) PRIMARY KEY(userUuid);

ALTER TABLE FantasyTeamDetails ADD CONSTRAINT FK_User_Details FOREIGN KEY(userUuid) REFERENCES UserDetails(userUuid);