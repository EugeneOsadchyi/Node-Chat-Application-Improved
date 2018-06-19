$(function() {
  var socket = io('/chat');

  initializeUploader(socket);

  var log = function(message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el);
  };

  var addChatMessage = function(message) {
    var messageElement = buildMessage(message);
    addMessageElement(messageElement);
  };

  var addChatMessages = function(messages) {
    var messageElements = buildMessages(messages);
    addMessageElements(messageElements);
  };

  var addMessageElement = function(el) {
    var $el = $(el);
    $('#messages').append($el);
    scrollToBottom();
  };

  var addMessageElements = function(elements) {
    $('#messages').html(elements);
    scrollToBottom(true);
  };

  var buildMessages = function(messages) {
    return messages.map(function(message) {
      return buildMessage(message);
    });
  }

  var buildMessage = function(message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = $('#message-template').html();

    return Mustache.render(template, {
      from: message.from,
      text: message.text,
      file: message.file,
      createdAt: formattedTime
    });
  };

  socket.emit('join', function(err) {
    if (err) {
      alert(err);
      window.location.href = '/lobby';
    } else {
      log('Connection established');
    }
  });

  socket.on('disconnect', function() {
    log('Disconnected from server');
  });

  socket.on('user joined', function(data) {
    log(data.name + ' joined');
  });

  socket.on('user left', function(data) {
    log(data.name + ' left');
  });

  socket.on('updateUserList', function(users) {
    var ol = $('<ol>');

    users.forEach(function(user) {
      ol.append($('<li>').text(user));
    });

    $('#users').html(ol);
  });

  socket.on('updateMessages', function(messages) {
    addChatMessages(messages);
  });

  socket.on('newMessage', function(message) {
    addChatMessage(message);
  });

  $('#message-form').on('submit', function(e) {
    e.preventDefault();

    const messageTextBox = $('[name=message]');

    socket.emit('createMessage', {
      text: messageTextBox.val()
    }, function(err) {
      if (err) {
        alert(err);
      } else {
        messageTextBox.val('');
      }
    });
  });
});

function initializeUploader (socket) {
  var uploader = new SocketIOFileUpload(socket);

  uploader.maxFileSize = 20000;
  uploader.useBuffer = true;
  uploader.chunkSize = 1024;

  uploader.addEventListener('complete', function(event){
    console.log(`Upload Complete: ${event.file.name}`);
  });

  // Improvement: add loading bar
  uploader.addEventListener('progress', function(event){
    console.log(`File is ${(event.bytesLoaded / event.file.size * 100).toFixed(2)} % loaded`);
  });

  uploader.addEventListener('load', function(event){
    console.log(`File Loaded: ${event.file.name}`);
  });

  uploader.addEventListener('error', function(event){
    console.log(`Error: ${event.message}`);
    if (event.code === 1) {
      alert(`Don't upload such a big file`);
    }
  });

  uploader.listenOnInput(document.getElementById('send_file'));

  window.uploader = uploader;
}

// To scroll to the most recent message
function scrollToBottom (forceToBottomScroll = false) {
  // Selectors
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (forceToBottomScroll || clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}
