// Saves options to chrome.storage.sync.
function save_options() {
    var code = document.getElementById('code').value;
    chrome.storage.sync.set({
        codigo: code,
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Codigo guardado';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        codigo: ''
    }, function (items) {
        document.getElementById('code').value = items.codigo;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);