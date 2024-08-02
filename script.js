const botToken = '7239458839:AAHTXtF23O2Zfe7q1OSOTtpQvbCjXCflFAg';
const chatId = '5541151768';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const context = canvas.getContext('2d');

// Access the device camera and stream to the video element
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing the camera: " + err);
    });

// Capture the image when the button is clicked
snap.addEventListener('click', () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL('image/jpeg');
    sendImageToTelegram(imageDataURL);
});

function sendImageToTelegram(imageDataURL) {
    fetch(imageDataURL)
        .then(res => res.blob())
        .then(blob => {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', blob, 'photo.jpg');

            fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    alert('Photo sent successfully!');
                } else {
                    alert('Failed to send photo.');
                }
            })
            .catch(error => {
                console.error('Error sending photo: ', error);
            });
        });
}
