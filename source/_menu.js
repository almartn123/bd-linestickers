lineemotes.menu = function () {}

lineemotes.menu.init = function () {
    quickEmoteMenu.lsContainer = this.buildContainer();
    
    // overriding
    // adding line tab into the callback function
    QuickEmoteMenu.prototype.obsCallback = function(e) {
        if (!settingsCookie["bda-es-9"]) 
            e.addClass("bda-qme-hidden");
         else 
            e.removeClass("bda-qme-hidden");
      
        if (!settingsCookie["bda-es-0"])
            return;
        e.prepend(this.qmeHeader);
        
        $('#bda-qem').append('<button id="bda-qem-line" onclick="quickEmoteMenu.switchHandler(this); return false;" class="active">Line</button>');
        
        e.append(this.teContainer);
        e.append(this.faContainer);
        e.append(this.lsContainer);
        if (this.lastTab === undefined)
            this.lastTab = "bda-qem-favourite";
        
        this.switchQem(this.lastTab);
    };
    
    // initializing stuff, 
    // making the tab openable, copying sticker URL into text area on click, initializing on-hover preview
    QuickEmoteMenu.prototype.switchQem = function(id) {
        var twitch = $("#bda-qem-twitch");
        var fav = $("#bda-qem-favourite");
        var emojis = $("#bda-qem-emojis");
        var line = $("#bda-qem-line");
        twitch.removeClass("active");
        fav.removeClass("active");
        emojis.removeClass("active");
        line.removeClass("active");
        $(".emoji-picker").hide();
        $("#bda-qem-favourite-container").hide();
        $("#bda-qem-twitch-container").hide();
        $("#bda-qem-line-container").hide();
        switch (id) {
        case "bda-qem-twitch":
            twitch.addClass("active");
            $("#bda-qem-twitch-container").show();
            break;
        case "bda-qem-favourite":
            fav.addClass("active");
            $("#bda-qem-favourite-container").show();
            break;
        case "bda-qem-emojis":
            emojis.addClass("active");
            $(".emoji-picker").show();
            break
        case "bda-qem-line":
            line.addClass("active");
            $("#bda-qem-line-container").show();
        }
        this.lastTab = id;
        var emoteIcon = $(".emote-icon");
        emoteIcon.off();
        emoteIcon.on("click", function() {
            // find out what tab we're dealing with
            if ($(this).parent().parent().attr("class") === 'line-pack-stickers') {
                // if dealing with line stickers tab, grab src
                var emote = $(this).attr("src");
            } else {
                // otherwise grab title attribute
                var emote = $(this).attr("title");
            }
            var ta = $(".channel-textarea-inner textarea");
            ta.val(ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
        });
        lineemotes.preview.init();
        lineemotes.categories.init();
        lineemotes.confirm.init();
        lineemotes.menu.resize();
    };
};

lineemotes.menu.buildContainer = function () {
    var stickers = '';
    var storage = lineemotes.storage.get();
    
    for (var pack = 0; pack < storage.length; ++pack) {
        stickers += lineemotes.pack.wrapPack(storage[pack]['starting_id']);
    }
    
    var container = `${lineemotes.getStylesheet()}
<div id="bda-qem-line-container">
    <div class="scroller-wrap fade">
        ${lineemotes.confirm.buildContainer()}
        <div class="scroller">
            <div class="emote-menu-inner">
                ${stickers}
            </div>
        </div>
    </div>
    ${lineemotes.preview.buildContainer()}
    ${lineemotes.categories.buildContainer()}
</div>`;
    return container;
};

lineemotes.menu.rebuild = function () {
    lineemotes.log('Rebuilding container');
    quickEmoteMenu.lsContainer = this.buildContainer();
};

lineemotes.menu.unload = function () {
    // reverting the overriden functions
    
    QuickEmoteMenu.prototype.obsCallback = function(e) {
        if (!settingsCookie["bda-es-9"]) {
            e.addClass("bda-qme-hidden");
        } else {
            e.removeClass("bda-qme-hidden");
        }
        if (!settingsCookie["bda-es-0"])
            return;
        var self = this;
        e.prepend(this.qmeHeader);
        e.append(this.teContainer);
        e.append(this.faContainer);
        if (this.lastTab == undefined) {
            this.lastTab = "bda-qem-favourite";
        }
        this.switchQem(this.lastTab);
    };
    
    QuickEmoteMenu.prototype.switchQem = function(id) {
        var twitch = $("#bda-qem-twitch");
        var fav = $("#bda-qem-favourite");
        var emojis = $("#bda-qem-emojis");
        twitch.removeClass("active");
        fav.removeClass("active");
        emojis.removeClass("active");
        $(".emoji-picker").hide();
        $("#bda-qem-favourite-container").hide();
        $("#bda-qem-twitch-container").hide();
        switch (id) {
        case "bda-qem-twitch":
            twitch.addClass("active");
            $("#bda-qem-twitch-container").show();
            break;
        case "bda-qem-favourite":
            fav.addClass("active");
            $("#bda-qem-favourite-container").show();
            break;
        case "bda-qem-emojis":
            emojis.addClass("active");
            $(".emoji-picker").show();
            break
        }
        this.lastTab = id;
        var emoteIcon = $(".emote-icon");
        emoteIcon.off();
        emoteIcon.on("click", function() {
            var emote = $(this).attr("title");
            var ta = $(".channel-textarea-inner textarea");
            ta.val(ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
        });
    };
    
    // setting the last opened tab to emoji tab
    quickEmoteMenu.lastTab = "bda-qem-emojis"
};


lineemotes.menu.setWidth = function(width) { 
    if (width < 346) { width = 346; lineemotes.log("Can't set width less than 346px"); }
    bdPluginStorage.set('lineemotes', 'width', width); 
    lineemotes.menu.resize();
};

lineemotes.menu.setHeight = function(height) { 
    if (height < 327) { height = 327; lineemotes.log("Can't set height less than 327px"); } 
    bdPluginStorage.set('lineemotes', 'height', height); 
    lineemotes.menu.resize();
};

lineemotes.menu.setSize = function(width, height) {
    lineemotes.menu.setWidth(width);
    lineemotes.menu.setHeight(height);
};

lineemotes.menu.getWidth = function(width) { return bdPluginStorage.get('lineemotes', 'width'); };
lineemotes.menu.getHeight = function(height) { return bdPluginStorage.get('lineemotes', 'height'); };
lineemotes.menu.getSize = function(width, height) {
    return {
        width: lineemotes.menu.getWidth(width),
        height: lineemotes.menu.getHeight(height)    
    };
};

lineemotes.menu.resize = function() {
    if (!lineemotes.menu.open()) return;
    var width = bdPluginStorage.get('lineemotes', 'width');
    var height = bdPluginStorage.get('lineemotes', 'height');

    if ((width === null) || (height === null)) return;
    if (width < 346) { 
        bdPluginStorage.set('lineemotes', 'width', 346);
        throw "Can't set width less than 346px"; }
    if (height < 327) { 
        bdPluginStorage.set('lineemotes', 'height', 327);
        throw "Can't set height less than 327px"; } 
    
    $('#bda-qem-line-container').css('width', width);
    $('#bda-qem-line-container').css('height', height);
    
    $('#bda-qem-line-container .preview-wrapper').css('height', height + 31);
    $('#bda-qem-line-container .preview-wrapper').css('transform', `translateX(-256px) translateY(-${height + 31}px) translateZ(0px)`);
    
    $('#bda-qem-line-container .categories-container').css('width', width - 15);
    $('#bda-qem-line-container .add-form').css('width', width - 45);
    $('#line-add-title').css('width', width - 220);
    $('#line-add-length').css('width', width - 220);
    $('#line-add-id').css('width', width - 219);
};

// remove sticker pack from current container
lineemotes.menu.removePack = function(id) {
    $(`#bda-qem-line-container .line-pack[data-id="${id}"]`).remove();
    $(`#bda-qem-line-container .categories-container .item[data-id="${id}"]`).remove();
};

lineemotes.menu.appendPack = function(id) {
    if (!lineemotes.menu.open()) return;
    lineemotes.log('Appending a pack to the current container');
    // append the pack to the current container
    var pack = lineemotes.pack.wrapPack(id);
    $('#bda-qem-line-container .emote-menu-inner').append(pack);
    
    // append the pack to navigation bar below
    var pack = lineemotes.storage.getPack(id);
    var id = pack['starting_id'];
    var position = $('#bda-qem-line-container .categories-wrapper .item').length - 1;
    var category = `<div class="item" data-id="${id}" onclick="$('#bda-qem-line-container .line-pack')[${position}].scrollIntoView()" style='background-image: url("https://sdl-stickershop.line.naver.jp/stickershop/v1/sticker/${id}/android/sticker.png;compress=true")'></div>`;
    $('#bda-qem-line-container .categories-wrapper').append(category);
    
    // enable preview on the added pack
    // make stickers copy url on a click
    $(`#bda-qem-line-container .line-pack[data-id="${id}"] img`)
        .mouseenter(function(e) { lineemotes.preview.show(e.target.src); })
        .mouseleave(function(e) { lineemotes.preview.hide(); })
        .on("click", function() {
            // find out what tab we're dealing with
            if ($(this).parent().parent().attr("class") === 'line-pack-stickers') {
                // if dealing with line stickers tab, grab src
                var emote = $(this).attr("src");
            } else {
                // otherwise grab title attribute
                var emote = $(this).attr("title");
            }
            var ta = $(".channel-textarea-inner textarea");
            ta.val(ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
        });
    
    // enable deletion
    $(`#bda-qem-line-container .line-pack[data-id="${id}"] .icon-plus-cross`).on('click', (event) => {
        var id = $(event.target.parentNode.parentNode.parentNode).attr('data-id');
        $('#bda-qem-line-container .confirm .yes').attr(
            'onclick',
            `lineemotes.storage.deletePack(${id}); lineemotes.menu.removePack(${id}); lineemotes.confirm.hide();`);
        lineemotes.confirm.show();
    });
    
    // enable editing
    $(`#bda-qem-line-container .line-pack[data-id="${id}"] .icon-edit`).on('click', (event) => {
        var pack = $(event.target.parentNode.parentNode.parentNode);
        if (pack.find('.line-pack-header input').length === 0) {
            var bar = $(event.target.parentNode.parentNode);
            var header = pack.find('.line-pack-header');
            var value = pack.find('.line-pack-header').text();
            header.html(`<input class="line-edit-input" value="${value}"></input>`);
            bar.addClass('visible') 
            
            function save(event) {
                var value = $(event.target).val();
                var id = $(event.target.parentNode.parentNode).attr('data-id');
                lineemotes.storage.renamePack(id, value);
                $(event.target.parentNode).html(value);
            }
            
            header.find('input')
                .on('blur', (event) => {
                    save(event);
                    bar.removeClass('visible');
                })
                .on('keydown', (event) => {
                    if ((event.key === 'Escape') || (event.key ==='Enter')) {
                        event.stopPropagation();
                        event.preventDefault();
                        //save(event);
                        event.target.blur();
                    }
                })
                .focus();
        }
    });
};

lineemotes.menu.open = function() {
    if ($(`#bda-qem-line-container`).length === 1) 
        return true;
    else 
        return false;
};