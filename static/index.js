document.addEventListener('DOMContentLoaded', () => {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    var ch_list = [];
    var users = ['admin'];
    localStorage.setItem('channel', 'Main');
    const lang = navigator.language
    localStorage.setItem('lang', lang)
    $('.toast').toast()
    socket.on('connect', () => {
      if (localStorage.getItem('user') === null){
        document.querySelector('#login_page').style.display = "block";
        document.querySelector('#home').style.display = "none";
        document.querySelector('#login').onclick = () => {
          var user = document.querySelector("#user-login").value;
          socket.emit('submit login', {'user': user});
        };
      } else {

        (function() {
          if( window.localStorage ){
            if( !localStorage.getItem('firstLoad') ){
              localStorage['firstLoad'] = true;
              location.reload();
            }
            else
              localStorage.removeItem('firstLoad');
          }
        })();


        if (localStorage.getItem('room') !== null) {
          document.querySelector('.chan-name').innerHTML = localStorage.getItem('room')
        } else {
          document.querySelector('.chan-name').innerHTML = 'Main'
        }

        document.querySelector('#login_page').style.display = "none";
        document.querySelector('#home').style.display = "block";

        var room = document.querySelector('.chan-name').innerHTML;
        socket.emit('change room', {'room':room});

        document.querySelector('#user').innerHTML = localStorage.getItem('user');
        document.querySelector('#create-channel').onclick = () => {
            if (document.querySelector("#channel-name").value === "") {
              socket.emit('send success', {'success': 'Please enter a name!'});
            } else {
              var ch_name = document.querySelector("#channel-name").value;
              socket.emit('create channel', {'ch_name': ch_name});
              document.querySelector("#channel-name").value='';
            }
        };

        document.querySelector('#button-addon2').onclick = () => {
          if (document.querySelector("#message").value === '') {
            socket.emit('send success', {'success': 'Please type a message!'});
          } else {
            const room = document.querySelector('.chan-name').innerHTML;
            const user = localStorage.getItem('user');
            const message = document.querySelector("#message").value;
            var ts = Math.round((new Date()).getTime() / 1000);
            document.querySelector('#message').value = ''
            document.querySelector('#message').focus()
            socket.emit('submit message room', {'user': user, 'message': message, 'room':room, 'ts':ts});
          }
        };
        document.querySelectorAll('.channel').forEach(a => {
          a.onclick = () => {
            const room = a.innerHTML
            localStorage.setItem('room', room);
            document.querySelector('.chan-name').innerHTML = room
            document.querySelector('.msg').innerHTML = '';
            socket.emit('change room', {'room':room});
          };
        });
      };
    });

    function updateScroll(){
      var element = document.querySelector(".msg");
      element.scrollTop = element.scrollHeight;
    }

    socket.on('add channel', data => {
        const a = document.createElement('a');
        const br = document.createElement('br');
        a.innerHTML = `${data.ch}`;
        a.setAttribute('href', '#');
        a.className += 'btn btn-primary channel btn-sm btn-block';
        a.style = 'margin-bottom: 10px'
        document.querySelector('#channel-list').appendChild(a);
        location.reload();
    });

    socket.on('success', data => {
      $('#toast').toast('show')
      document.querySelector('.toast-body').innerHTML = `${data.success}`
    });
    socket.on('alert', data => {
      alert(`${data.alert}`)
      location.reload();
    });

    socket.on('add user', data => {
      localStorage.setItem('user', `${data.usr}`);
      socket.emit('connect');
      alert(usr);
    });
    socket.on('send to room', data => {
      var room = `${data.room}`

      var unix_timestamp = `${data.time}`
      var date = new Date(unix_timestamp * 1000);
      const optionsDate = { month: 'long', day: 'numeric' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      var formattedTime = date.toLocaleTimeString(localStorage.getItem('lang'), optionsTime)
      var formattedDate = date.toLocaleDateString(localStorage.getItem('lang'), optionsDate);

      if (document.querySelector('.chan-name').innerHTML === room) {
        const a_date = document.createElement('a');
        const br = document.createElement('br');
        const end_msg = document.createElement('br');
        const asd = document.createElement('br');
        const mid = document.createElement('br');
        a_date.innerHTML = formattedDate + ' - ' + formattedTime;

        if (localStorage.getItem('user') === `${data.user}`){
          a_date.className += 'float-right ' + `${data.id}`
          const a = document.createElement('a');
          a.type = 'button';
          a.className += 'btn btn-warning a-msg float-right ' + `${data.id}`
          a.style = 'text-align: left; left: 100%;';

          a.onclick = function() {
            var text = `${data.message}`;
            var user = localStorage.getItem('user');
            var id = `${data.id}`;
            a.innerHTML = "This message has been deleted!"
            a_date.style = "display: none;"
            var room = document.querySelector('.chan-name').innerHTML;
            socket.emit('remove message', {'id': id, 'room':room, 'time':`${data.time}`, 'user':user, 'text':text});
          };

          a.innerHTML = `<b>${data.user}</b>: <br>${data.message}`;

          document.querySelector('.msg').append(a_date);
          document.querySelector('.msg').append(br);
          document.querySelector('.msg').append(a);
          document.querySelector('.msg').append(mid);
          document.querySelector('.msg').append(end_msg);
          document.querySelector('.msg').append(asd);
        } else {
          a_date.className += `${data.id}`
          const a = document.createElement('a');
          a.type = 'button';
          a.className += 'btn btn-info a-msg ' + `${data.id}`
          a.style = 'text-align: left'
          a.innerHTML = `<b>${data.user}</b>: <br>${data.message}`;

          document.querySelector('.msg').append(a_date);
          document.querySelector('.msg').append(br);
          document.querySelector('.msg').append(a);
          document.querySelector('.msg').append(mid);
          document.querySelector('.msg').append(end_msg);
        }

        updateScroll()
      }

    });

    socket.on('changed room', data => {
      var unix_timestamp = `${data.time}`
      var date = new Date(unix_timestamp * 1000);
      const optionsDate = { month: 'long', day: 'numeric' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      var formattedTime = date.toLocaleTimeString(localStorage.getItem('lang'), optionsTime)
      var formattedDate = date.toLocaleDateString(localStorage.getItem('lang'), optionsDate);

      const a_date = document.createElement('a');
      const br = document.createElement('br');
      const end_msg = document.createElement('br');
      const mid = document.createElement('br');
      const asd = document.createElement('br');
      a_date.innerHTML = formattedDate + ' - ' + formattedTime;

      if (localStorage.getItem('user') === `${data.user}`){
        a_date.className += 'float-right ' + `${data.id}`
        const a = document.createElement('a');
        a.type = 'button';
        a.className += 'btn btn-warning a-msg float-right ' + `${data.id}`
        a.style = 'text-align: left; left: 100%;';

        a.onclick = function() {
          var text = `${data.text}`;
          var user = localStorage.getItem('user');
          var id = `${data.id}`;
          a.innerHTML = "This message has been deleted!"
          a_date.style = "display: none;"
          var room = document.querySelector('.chan-name').innerHTML;
          socket.emit('remove message', {'id': id, 'room':room, 'time':`${data.time}`, 'user':user, 'text':text});
        };

        a.innerHTML = `<b>${data.user}</b>: <br>${data.text}`;

        document.querySelector('.msg').append(a_date);
        document.querySelector('.msg').append(br);
        document.querySelector('.msg').append(a);
        document.querySelector('.msg').append(mid);
        document.querySelector('.msg').append(end_msg);
        document.querySelector('.msg').append(asd);
      } else {
        const a = document.createElement('a');
        a_date.className += `${data.id}`
        a.type = 'button';
        a.className += 'btn btn-info a-msg ' + `${data.id}`
        a.style = 'text-align: left'
        a.innerHTML = `<b>${data.user}</b>: <br>${data.text}`;

        document.querySelector('.msg').append(a_date);
        document.querySelector('.msg').append(br);
        document.querySelector('.msg').append(a);
        document.querySelector('.msg').append(mid);
        document.querySelector('.msg').append(end_msg);
      }

      updateScroll()
    });

    socket.on('removed', data => {
      id = `${data.id}`

      var els = document.getElementsByClassName(id)

      els[0].remove()
      els[0].innerHTML = "This message has been deleted!"
      els[0].classList.remove(`${data.id}`);
    });
});
