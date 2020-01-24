const input = document.querySelector("#fileInputArea");
const btnSend = document.querySelector("#btnSend");
const resultText = document.querySelector("#resultText");

const loading = document.querySelector(".loader");

btnSend.addEventListener('click', () => {
    console.log(input.files[0]);
    uploadFile(input.files[0]);
});

loading.setAttribute('style', 'display:none');

const uploadFile = (file) => {

    if (file != null) {

        loading.setAttribute('style', 'display:block');

        if (!['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml'].includes(file.type)) {
            console.log('Only images are allowed.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            console.log('File must be less than 2MB.');
            return;
        }

        const fd = new FormData();
        fd.append('file', file);

        fetch('http://localhost:5000/api', {
            method: 'POST',
            body: fd
        })
            .then(res => res.json())
            .then(json => {

                console.log(json);
                var html = "";
                resultText.value = json;
                loading.setAttribute('style', 'display:none');
            })
            .catch(err => console.error(err));
    } else {
        alert("Resim Alanını Lutfen Doldurun");
    }
}
