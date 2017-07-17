function CommandParser(){};

CommandParser.prototype.Parse = function(command){
    var temp = command.trim().split(' ');
    var time = -1;
    
    if(temp.length > 1)
    {
        time = parseInt(temp[1]);
    }

    return {
        Command : temp[0].toUpperCase(),
        Time : time
    }
}

module.exports = CommandParser;