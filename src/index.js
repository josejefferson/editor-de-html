const editorOpts = {
    theme: 'vs-dark',
    automaticLayout: true,
    wordWrap: true,
    tabSize: 2,
    fontSize: 12,
    minimap: {
        enabled: false
    },
    scrollbar: {
        verticalHasArrows: true,
        verticalScrollbarSize: 10
    }
}

const htmlEditor = monaco.editor.create(document.getElementById('editor-html'), {
    value: localStorage.getItem('editor.code') || '',
    language: 'html',
    ...editorOpts
})

const cssEditor = monaco.editor.create(document.getElementById('editor-css'), {
    value: localStorage.getItem('editor.code.css') || '',
    language: 'css',
    ...editorOpts
})

const jsEditor = monaco.editor.create(document.getElementById('editor-js'), {
    value: localStorage.getItem('editor.code.js') || '',
    language: 'javascript',
    ...editorOpts
})

let currentEditor = htmlEditor
emmetMonaco.emmetHTML(monaco)
monaco.editor.defineTheme('dracula', draculaTheme)
monaco.editor.setTheme('dracula')

function onLoad() {
    if (new URL(window.location.href).searchParams.get('app') != null) {
        $('.home').remove()
    }
    $('.loadingView').fadeOut(250)
    $('meta[name=theme-color]').attr('content', '#303F9F')
    $('body').css('background-color', 'var(--background-color)')
    $('.menuFade').attr('onclick', 'closeMenu(); editor.focus();')
    $('#openFile').change(function () {
        openFile()
    })
    htmlEditor.focus()
}

// Ao sair do editor
window.onbeforeunload = confirmExit
function confirmExit() {
    if (htmlEditor.getValue() != '' || cssEditor.getValue() != '' || jsEditor.getValue() != '') {
        return ''
    }
}

let resizing = false
$('.resizeBar').mousedown(function (e) {
    resizing = true
})

let editorWidth = null
$('body').mousemove(function (e) {
    if (!resizing) return
    e.preventDefault()
    const bodyWidth = document.body.clientWidth
    editorWidth = e.clientX
    if (editorWidth > (bodyWidth - 10)) return
    $('.editor').css('flex-basis', editorWidth + 'px')
    $('.editor-tabs').css('width', editorWidth + 'px')
    $('.editor').css('width', '0')
    $('.editor').css('transition', 'none')
})

$('body').mouseup(function (e) {
    resizing = false
    $('.editor').css('transition', '')
})

function showEditor(editor) {
    $('#editor-html').removeClass('show')
    $('#editor-css').removeClass('show')
    $('#editor-js').removeClass('show')
    $('#editor-' + editor).addClass('show')
    $('.tab-html').removeClass('selected')
    $('.tab-css').removeClass('selected')
    $('.tab-js').removeClass('selected')
    $('.tab-' + editor).addClass('selected')
    if (editor === 'html') currentEditor = htmlEditor
    if (editor === 'css') currentEditor = cssEditor
    if (editor === 'js') currentEditor = jsEditor
    currentEditor.focus()
}

var interval, code
function previewHTML() {
    var input = htmlEditor.getValue()
    input += '<style>'
    input += cssEditor.getValue()
    input += '</style>'
    input += '<script>'
    input += jsEditor.getValue()
    input += '</script>'
    var output = $('#output')[0].contentWindow.document
    if (code != input) {
        code = htmlEditor.getValue()
        code += '<style>'
        code += cssEditor.getValue()
        code += '</style>'
        code += '<script>'
        code += jsEditor.getValue()
        code += '</script>'
        output.open()
        output.write(code)
        output.close()
        saveCodeOnBrowser()
    }
}
interval = setInterval(previewHTML, 150)

setInterval(updateTitle, 150)
function updateTitle() {
    document.title = $('#output')[0].contentDocument.title || 'Editor de HTML'
}

function saveCodeOnBrowser() {
    localStorage.setItem('editor.code', htmlEditor.getValue())
    localStorage.setItem('editor.code.css', cssEditor.getValue())
    localStorage.setItem('editor.code.js', jsEditor.getValue())
}

let wordWrap = true
function toggleWordWrap() {
    wordWrap = !wordWrap
    htmlEditor.updateOptions({ wordWrap })
    cssEditor.updateOptions({ wordWrap })
    jsEditor.updateOptions({ wordWrap })
}

function unloadHTML() {
    $('#output').replaceWith('<iframe id="output"></iframe>')
    code = ''
}

function reloadHTML() {
    unloadHTML()
    previewHTML()
}

function manualPreviewHTML() {
    clearInterval(interval)
}

function autoPreviewHTML() {
    interval = setInterval(previewHTML, 150)
}

function expandCode() {
    manualPreviewHTML()
    unloadHTML()
    $('.editor').css('flex-basis', '100%')
    $('.editor').css('width', '100%')
    $('.mainView #output').remove()
    $('.resultView').html('<iframe id="output"></iframe>')
    $('.refresh').attr('onclick', 'viewResult();').children('i').removeClass('mdi-refresh').addClass('mdi-check')
    $('.visualization').attr('onclick', 'revertCode();').children('i').removeClass('mdi-view-stream').addClass('mdi-view-compact')
}

function revertCode() {
    autoPreviewHTML()
    $('.editor').css('flex-basis', editorWidth ? editorWidth + 'px' : 'calc(30% - 2.5px)')
    $('.editor').css('width', '0')
    $('.resultView #output').remove()
    $('.mainView').html('<iframe id="output"></iframe>')
    $('.refresh').attr('onclick', 'reloadHTML();').children('i').removeClass('mdi-check').addClass('mdi-refresh')
    $('.visualization').attr('onclick', 'expandCode();').children('i').removeClass('mdi-view-compact').addClass('mdi-view-stream')
    unloadHTML()
    previewHTML()
}

function viewResult() {
    previewHTML()
    $('.result').css('top', '0')
}

function hideResult() {
    unloadHTML()
    $('.result').css('top', '100%')
}

// Dá foco ao editor ao clicar em diversos elementos
$('.topbar:not(.result-topbar), .side-button, .menu button, .menu a, .menuFade, .snackBar').click(function () {
    currentEditor.focus()
})

// Função de adicionar código
function addCode(text) {
    htmlEditor.trigger('keyboard', 'type', { text })
}

const libraries = {
    html: '<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="UTF-8">\n\t<title></title>\n</head>\n<body>\n\t\n</body>\n</html>',
    jquery: '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>',
    bootstrap: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css">\n\n<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.1.3/js/bootstrap.min.js"></script>',
    materialize: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">\n\n<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>',
    fontawesome: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">',
    materialicons: '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">',
    materialdesignicons: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css">',
    sweetalert2: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.4.23/sweetalert2.min.css">\n\n<script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.4.23/sweetalert2.min.js"></script>',
    axios: '<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>',
    moment: '<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>',
    angularjs: '<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js"></script>',
    cleave: '<script src="https://cdn.jsdelivr.net/npm/cleave.js@1.6.0/dist/cleave.min.js"></script>',
    lodash: '<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>',
    underscore: '<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.4/underscore-min.js"></script>'
}

// Funções de adicionar códigos prontos no editor
function addLibrary(name) {
    const code = libraries[name]
    if (!code) return
    addCode(code)
}

// Função: copiar código
function copyCode() {
    currentEditor.setSelection(currentEditor.getModel().getFullModelRange())
    currentEditor.trigger('source', 'editor.action.clipboardCopyAction')
    snackBar('.copyCode')
}

// Função: apagar código
function deleteCode() {
    var confirmDeleteCode = confirm('Tem certeza que deseja apagar todos os códigos?')
    if (confirmDeleteCode == 1) {
        htmlEditor.setValue('')
        cssEditor.setValue('')
        jsEditor.setValue('')
        snackBar('.deleteCode')
    }
}

// Função: organizar código
function beautifierCode() {
    currentEditor.trigger('', 'editor.action.formatDocument')
    snackBar('.beautifierCode')
}

// Função: abrir arquivo
function openFile() {
    if (currentEditor.getValue() != '') {
        var fileOpenConfirm = confirm('Tem certeza de que deseja abrir o arquivo?\nTodo o código anterior será perdido')
        if (fileOpenConfirm == true) {
            input = document.getElementById('openFile')
            file = input.files[0]
            fr = new FileReader()
            fr.onload = receivedText
            fr.readAsText(file)
        }
        else {
            $('#openFile').val('')
        }
    }
    else {
        input = document.getElementById('openFile')
        file = input.files[0]
        fr = new FileReader()
        fr.onload = receivedText
        fr.readAsText(file)
    }
}
function receivedText() {
    currentEditor.setValue(fr.result)
    currentEditor.focus()
    $('#openFile').val('')
}

// Função: salvar arquivo
function saveFile() {
    var fileName = prompt('Digite o nome do arquivo (sem extensão)')
    if (fileName != null) {
        if (currentEditor === htmlEditor) {
            $('.fileDownloadLink').attr('download', fileName + '.html')
            $('.fileDownloadLink').attr('href', 'data:text/html,' + encodeURIComponent(htmlEditor.getValue()))
            $('.fileDownloadLink').click()
            snackBar('.saveFile')
        }
        if (currentEditor === cssEditor) {
            $('.fileDownloadLink').attr('download', fileName + '.css')
            $('.fileDownloadLink').attr('href', 'data:text/css,' + encodeURIComponent(cssEditor.getValue()))
            $('.fileDownloadLink').click()
            snackBar('.saveFile')
        }
        if (currentEditor === jsEditor) {
            $('.fileDownloadLink').attr('download', fileName + '.js')
            $('.fileDownloadLink').attr('href', 'data:text/javascript,' + encodeURIComponent(jsEditor.getValue()))
            $('.fileDownloadLink').click()
            snackBar('.saveFile')
        }
    }
}

// Mostrar ou ocultar caracteres invisíveis
function showInvisibleCharacters() {
    currentEditor.setShowInvisibles(true)
    $('.hiddenCharacters').attr('onclick', 'hideInvisibleCharacters()').children('i').removeClass('mdi-eye').addClass('mdi-eye-off')

}
function hideInvisibleCharacters() {
    currentEditor.setShowInvisibles(false)
    $('.hiddenCharacters').attr('onclick', 'showInvisibleCharacters()').children('i').removeClass('mdi-eye-off').addClass('mdi-eye')
}

// Função: tela cheia
function fullScreen() {
    var doc = window.document
    var docEl = doc.documentElement
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl)
        $('.fullScreen i').removeClass('mdi-fullscreen').addClass('mdi-fullscreen-exit')
    }
    else {
        cancelFullScreen.call(doc)
        $('.fullScreen i').removeClass('mdi-fullscreen-exit').addClass('mdi-fullscreen')
    }
}