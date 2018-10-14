(function(){

  // force orientation
  screen.orientation.lock('landscape');

  var permissions = cordova.plugins.permissions;

  permissions.requestPermission(permissions.RECORD_AUDIO, success, error);

  function error() {
    console.warn('Audio recorder permission is not turned on');
  }

  function success( status ) {
    if( !status.hasPermission ) error();
  }
 })();