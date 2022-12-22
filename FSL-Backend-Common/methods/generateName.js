// returns team name 
// Eg: team-JHSVK


exports.generateName = function () {
    var name = ''
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
}
