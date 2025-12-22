/*Kontaktformular */
(function(){
  emailjs.init("Sl84j0B2HghdKWLSa");
})();

document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Formulardaten abrufen
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  // Validierung
  if (name === "" || email === "" || phone === "" || message === "") {
      Swal.fire({
          title: 'Fehler!',
          text: 'Alle Felder müssen ausgefüllt werden.',
          icon: 'error',
          confirmButtonText: 'OK'
      });
      return;
  }

  if (!validateEmail(email)) {
      Swal.fire({
          title: 'Fehler!',
          text: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
          icon: 'error',
          confirmButtonText: 'OK'
      });
      return;
  }

  if (!validatePhone(phone)) {
      Swal.fire({
          title: 'Fehler!',
          text: 'Bitte geben Sie eine gültige Telefonnummer ein.',
          icon: 'error',
          confirmButtonText: 'OK'
      });
      return;
  }

  // Parameter für EmailJS
  const templateParams = {
      user_name: name,
      user_email: email,
      user_phone: phone,
      message: message
  };

  // Wenn die Validierung erfolgreich ist, sende das Formular
  emailjs.send('service_vq94udh', 'template_r9vux75', templateParams)
      .then(function() {
          Swal.fire({
              title: 'Nachricht gesendet!',
              text: 'Ihre Nachricht wurde erfolgreich versendet.',
              icon: 'success',
              confirmButtonText: 'OK'
          });
          
          // Felder leeren
          document.getElementById('contact-form').reset();
      }, function(error) {
          console.error('Fehler beim Senden der Nachricht:', error);
          Swal.fire({
              title: 'Fehler!',
              text: 'Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut.',
              icon: 'error',
              confirmButtonText: 'OK'
          });
      });
});

// Hilfsfunktion zur E-Mail-Validierung
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Hilfsfunktion zur Telefonnummern-Validierung
function validatePhone(phone) {
  const re = /^[+]?[\d\s-]{7,15}$/;
  return re.test(String(phone));
}
