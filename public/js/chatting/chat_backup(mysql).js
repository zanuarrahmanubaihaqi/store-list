function chatting(root_url, current_user, cek_it) {
    $(function () {
        let banyak_data_realTime = 0;
        let get_users = root_url.concat('chatting/chat/get_users');
        let kirim_pesan = root_url.concat('chatting/chat/sender_message');
        let history_message = root_url.concat('chatting/chat/history_message');
        let unread = root_url.concat('chatting/chat/update_unread');
        let cnt_unread = root_url.concat('chatting/chat/count_unread');
        var banyak_pesan = 0;
        function load_data_chatting_real_time() {
            $.ajax({
                type: "GET",
                url: get_users,
                dataType: "JSON",
                cache: false,
                beforeSend: () => {

                },
                success: (data_users) => {
                    banyak_data_realTime += cek_it;
                    let cnt = 0;
                    for(i in data_users) {
                        if(current_user != data_users[i].id_users) {
                            cnt += 1;
                        }
                    }

                    if(cek_it != cnt) {
                        $("#work").html("");
                        window.new_gr_id = neonChat.createGroup('Work', true);
                        cek_it = cnt;
                        for(i in data_users) {
                            if(current_user != data_users[i].id_users) {
                                let status;
                                let is_status;
                                if(data_users[i].online == '1') {
                                    status = "online";
                                    is_status = "is-online"
                                } else {
                                    status = "offline";
                                    is_status = "is-offline";
                                }
                                // let user = '<a href="#" id="'+data_users[i].id_users+'"><span class="user-status '+ is_status +'"></span> <em>'+ data_users[i].full_name +'</em> <span class="badge badge-info is-hidden">0</span></a>';
                                neonChat.addUser(new_gr_id, data_users[i].full_name, status, true, data_users[i].id_users);
                                // $("#work").append(user);
                                neonChat.setStatus(data_users[i].id_users, status);
                            }
                        }
                    } else {
                        cek_it = cnt;
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {

                },
                complete: () => {
                    
                }
            });
        }

        function user_status() {
            $.ajax({
                type: "GET",
                url: get_users,
                dataType: "JSON",
                cache: false,
                beforeSend: () => {

                },
                success: (data_users) => {
                    for(i in data_users) {
                        if(current_user != data_users[i].id_users) {
                            let status;
                            if(data_users[i].online == '1') {
                                status = "online";
                            } else {
                                status = "offline";
                            }
                            neonChat.setStatus(data_users[i].id_users, status);
                        }
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {

                },
                complete: () => {
                    
                }
            });
        }


        function load_data_chatting() {
            $.ajax({
                type: "GET",
                url: get_users,
                dataType: "JSON",
                cache: false,
                beforeSend: () => {

                },
                success: (data_users) => {
                    window.new_gr_id = neonChat.createGroup('Work', true);
                    for(i in data_users) {
                        if(current_user != data_users[i].id_users) {
                            let status;
                            let is_status;
                            if(data_users[i].online == '1') {
                                status = "online";
                                is_status = "is-online"
                            } else {
                                status = "offline";
                                is_status = "is-offline";
                            }
                            // let user = '<a href="#" id="'+data_users[i].id_users+'"><span class="user-status '+ is_status +'"></span> <em>'+ data_users[i].full_name +'</em> <span class="badge badge-info is-hidden">0</span></a>';
                            neonChat.addUser(new_gr_id, data_users[i].full_name, status, true, data_users[i].id_users);
                            // $("#work").append(user);
                            neonChat.setStatus(data_users[i].id_users, status);
                        }
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {

                },
                complete: () => {
                    
                }
            });
        }

        let timer_chat = setTimeout(load_data_chatting_real_time, 2500);
		$("#chat").hover(
			function() {
				clearInterval(timer_chat);
			},
			function() {
				timer_chat = setTimeout(load_data_chatting_real_time, 2500);
			}
        );

        load_data_chatting();
        setInterval(user_status, 1000);
        
        var chat_user = null,
            chat = $("#chat"),
            conversation_window = chat.find(".chat-conversation"),
            chat_badge = chat.find('.badge').add($('.chat-notifications-badge')),
            conversation_header = conversation_window.find(".conversation-header"),
            conversation_body = conversation_window.find(".conversation-body"),
            textarea = conversation_window.find('.chat-textarea textarea');
        function send_message() {
            chat.on('click', ".chat-group a", function(ev) {
                ev.preventDefault();
                chat_user = $(this).attr('id');
                textarea.keydown((e) => {
                    let time = new Date();
                    let fromOpponent = 1;
                    let unread = 1;
                    if(e.keyCode == 13 && !e.shiftKey) {
                        let pesan = textarea.val().trim();
                        textarea.val('');
                        if(pesan != "") {
                            $.ajax({
                                type: "POST",
                                url: kirim_pesan,
                                dataType: "JSON",
                                cache: false,
                                data: {
                                    receiver: chat_user,
                                    message: pesan,
                                    from: current_user,
                                    time: time,
                                    fromOpponent: fromOpponent,
                                    unread: unread 
                                },
                                beforeSend: () => {

                                },
                                success: (get_data) => {

                                },
                                error: (jqXHR, textStatus, errorThrown) => {
                                    alert(textStatus +" "+errorThrown);
                                    // $("#modal-error-ajax").modal('show');
                                }
                            });
                        }

                        update_unread();
                    }
                });

                update_unread();
                count_message();
                setInterval(fetch_message, 1500);
            });            
        }

        conversation_header.on('click', '.conversation-close', function(ev) {
            ev.preventDefault();
            update_unread();
            chat_user = null;
        });

        function count_message() {
            $.ajax({
                type: "GET",
                url: history_message,
                dataType: "JSON",
                cache: false,
                data: {
                    id_receiver: chat_user,
                    from: current_user
                },
                beforeSend: () => {
    
                },
                success: (get_data) => {
                    conversation_body.html('');
                    let history_chat = get_data.history_message;
                    for(let i in history_chat) {
                        banyak_pesan += 1;
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    alert(textStatus +" "+errorThrown);
                    // $("#modal-error-ajax").modal('show');
                }
            });
        }

        // FETCH MESSAGE
        function fetch_message() {
            $.ajax({
                type: "GET",
                url: history_message,
                dataType: "JSON",
                cache: false,
                data: {
                    id_receiver: chat_user,
                    from: current_user
                },
                beforeSend: () => {
    
                },
                success: (get_data) => {
                    if(!get_data) {
                        return false;
                    }
                    conversation_body.html('');
                    let users = get_data.list_user;
                    let history_chat = get_data.history_message;
                    let count_history_message = get_data.count_history_message;
                    for(let i in history_chat) {
                        let messages = history_chat[i].message,
                            entry = $('<li><span class="user"></span><p></p><span class="time"></span></li>'),
                            date = new Date(history_chat[i].time),
                            date_formated = date,
                            id_from = history_chat[i].id_from,
                            from = null;
    
                        if(typeof date == 'object') {
                            var	hour = date.getHours(),
                                hour = (hour < 10 ? "0" : "") + hour,
    
                                min  = date.getMinutes(),
                                min = (min < 10 ? "0" : "") + min,
    
                                sec  = date.getSeconds(),
                                sec = (sec < 10 ? "0" : "") + sec;
    
                                date_formated = hour + ':' + min;
                        }

                        if(history_chat[i].fromOpponent && current_user != id_from) {
                            entry.addClass('odd');
                        }
    
                        if(history_chat[i].unread == 1) {
                            history_chat[i].unread = true;
                        } else {
                            history_chat[i].unread = false;
                        }
    
                        if(history_chat[i].unread && current_user != id_from) {
                            entry.addClass('unread');
                        }
                                    
                        for(let j in users) {
                            if(id_from == users[j].id_users) {
                                from = users[j].full_name;
                                break;
                            }
                        }
    
                        entry.find('.user').html(from);
                        entry.find('p').html(messages.replace(/\n/g, '<br>'));
                        entry.find('.time').html(date_formated);
                    
                        conversation_body.append(entry);
                    }
                    
                    if(count_history_message != banyak_pesan) {
                        banyak_pesan = count_history_message;
                        scrollToBottom('#chat .chat-conversation .conversation-body');
                    } else {
                        banyak_pesan = count_history_message;
                    }

                },
                error: (jqXHR, textStatus, errorThrown) => {
                    alert(textStatus +" "+errorThrown);
                    // $("#modal-error-ajax").modal('show');
                }
            });
        }

        function update_unread() {
            $.ajax({
                type: "POST",
                url: unread,
                dataType: "JSON",
                cache: false,
                data: {
                    id_receiver: current_user,
                    id_from: chat_user,
                },
                beforeSend: () => {

                },
                success: (get_data) => {
                    if(get_data) {

                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    alert(textStatus +" "+errorThrown);
                    // $("#modal-error-ajax").modal('show');
                }
            });
        }


        function count_unread() {
            $.ajax({
                type: "GET",
                url: cnt_unread,
                dataType: "JSON",
                cache: false,
                data: {
                    id_receiver: current_user,
                },

                beforeSend: () => {

                },

                success: (get_data) => {
                    let all_message = get_data;
                    let count_unread_all = 0;
                    chat.find('.chat-group a').each(function(i, el) {
                        var elem = $(el),
                            id = elem.attr('id'),
                            count_message_current_user = 0,
                            badge_by_user = $("#"+id).find('.badge');
                        for(let i in all_message) {
                            if(id === all_message[i].id_from) {
                                if(all_message[i].unread == 1) {
                                    all_message[i].unread = true;
                                } else {
                                    all_message[i].unread = false;
                                }

                                if(all_message[i].unread) {
                                    count_message_current_user++;
                                    count_unread_all++;
                                }
                            }
                        }
                        if(count_message_current_user > 0) {
                            badge_by_user.text(count_message_current_user).removeClass('is-hidden');    
                        } else {
                            badge_by_user.text(count_message_current_user).addClass('is-hidden'); 
                        }
                    });
                    

                    if(count_unread_all > 0) {
                        chat_badge.text(count_unread_all);
                        chat_badge.removeClass('is-hidden');
                    } else {
                        chat_badge.addClass('is-hidden');
                    }
                },

                error: (jqXHR, textStatus, errorThrown) => {
                    alert(textStatus +" "+errorThrown);
                }
            });
        }
        send_message();
        setInterval(count_unread, 1000);
    });
}