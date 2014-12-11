/**
 * Created by sg_2 on 09-12-2014.
 */
var debugStrExecFn = '';
var keyPressedNow = '';
var debugStr = '';
var counter = 0;
var fps = 0;
function showDebugInfo(game, ship, asteroids, bullets) {

    debugStr = 'ship: pos Center= ['  + ship.posCenter[0] + ', ' + ship.posCenter[1]
                         +'] <br>angle:' + ship.angle + '<br>asteroids in space length' + asteroids.length
                        +'<br>bullets in space length:' + bullets.length + '<br>fps:' + fps;
    var debugInfoEl = document.getElementById('debug');
    debugInfoEl.innerHTML = debugStr;

}