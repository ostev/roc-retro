interface Program
    exposes [ game, Game ]
    imports [ pf.Task.{ Task }]

Game : { init : model, update : }

game : Task {} []