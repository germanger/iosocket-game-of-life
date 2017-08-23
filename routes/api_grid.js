var express = require('express');
var shortid = require('shortid');
var shared = require('../shared');
var _ = require('underscore');

var router = express.Router();

router.get('/current', function(req, res, next) {

    res.json({
        error: false,
        grid: shared.grid
    });
});

router.get('/start', function(req, res, next) {

    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
    }
    
    if (shared.intervalId) {
        res.json({
            error: false
        });
        
        return;
    }
    
    var message = {
        messageType: 'userStartedSimulation',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username,
        }
    };
    
    var _countLiveNeighbors = function(row, col, grid) {
    	var count = 0;

        for (var i = -1; i <= 1; i++)
        {
            for (var j = -1; j <= 1; j++)
            {
                var neighborRow = row + i;
                var neighborColumn = col + j;

                // The cell itself is not a neighbor
                if (i == 0 && j == 0) 
                {
                    continue;
                }

                // Border cases
                if ((neighborRow == -1) || (neighborRow == shared.grid.rows) || (neighborColumn == -1) || (neighborColumn == shared.grid.cols))
                {
                    continue;
                }

                // We've found a live neighbor
                if (grid[neighborRow][neighborColumn])
                {
                	count++;
                }

            }
        }

        return count;
    }

    // Start simulation
    shared.intervalId = setInterval(function() {
        
        //shared.grid.cells[0][0] = !shared.grid.cells[0][0];
        
        // Backup current grid
        var backup = shared.grid.cells.map(function(arr) {
                return arr.slice();
        });

        // Review rules for each cell
        for (var i = 0; i < shared.grid.rows; i++)
        {
            for (var j = 0; j < shared.grid.cols; j++)
            {
                var liveNeighborsCount = _countLiveNeighbors(i, j, backup);

                if (shared.grid.cells[i][j] == true)
                {
                    if (liveNeighborsCount == 2 || liveNeighborsCount == 3)
                    {
                        // Continue living
                    }
                    else
                    {
                        shared.grid.cells[i][j] = false;
                    }
                }
                else
                {
                    if (liveNeighborsCount == 3)
                    {
                        shared.grid.cells[i][j] = true;
                    }

                }
            }
        }
        
        
        
        
        // Broadcast message
        shared.io.sockets.emit('gridUpdate', {
        });
        
    }, 1000);

    // Save message
    shared.messages.push(message);

    // Broadcast message
    shared.io.sockets.emit('userStartedSimulation', {
        message: message
    });

    res.json({
        error: false
    });
});

router.get('/pause', function(req, res, next) {

    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
    }
    
    if (!shared.intervalId) {
        res.json({
            error: false
        });
        
        return;
    }
    
    var message = {
        messageType: 'userPausedSimulation',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username,
        }
    };

    // Pause simulation
    clearInterval(shared.intervalId);
    shared.intervalId = undefined;
    
    // Save message
    shared.messages.push(message);

    // Broadcast message
    shared.io.sockets.emit('userPausedSimulation', {
        message: message
    });

    res.json({
        error: false
    });
});

router.get('/click', function(req, res, next) {

    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
    }
    
    var message = {
        messageType: 'userClickedGrid',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username,
        },
        x: req.query.x,
        y: req.query.y
    };

    // Current value
    var currentValue = shared.grid.cells[req.query.x][req.query.y];
    
    // Toggle
    shared.grid.cells[req.query.x][req.query.y] = !shared.grid.cells[req.query.x][req.query.y];

    // Save message
    shared.messages.push(message);

    // Broadcast message
    shared.io.sockets.emit('userClickedGrid', {
        message: message
    });

    res.json({
        error: false
    });
});

module.exports = router;