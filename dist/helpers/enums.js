"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.PredictionResult = exports.MatchStatus = void 0;
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["SCHEDULED"] = "scheduled";
    MatchStatus["LIVE"] = "live";
    MatchStatus["FINISHED"] = "finished";
    MatchStatus["POSTPONED"] = "postponed";
    MatchStatus["CANCELLED"] = "cancelled";
})(MatchStatus || (exports.MatchStatus = MatchStatus = {}));
var PredictionResult;
(function (PredictionResult) {
    PredictionResult["HOME"] = "home";
    PredictionResult["AWAY"] = "away";
    PredictionResult["DRAW"] = "draw";
})(PredictionResult || (exports.PredictionResult = PredictionResult = {}));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["MODERATOR"] = "moderator";
})(UserRole || (exports.UserRole = UserRole = {}));
