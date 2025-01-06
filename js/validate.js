(function () {
  "use strict";

  document.querySelectorAll('.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = form.querySelector("input[name='name']").value.trim();
      const email = form.querySelector("input[name='email']").value.trim();
      const phone = form.querySelector("input[name='phone']").value.trim();
      const message = form.querySelector("textarea[name='message']").value.trim();
      const files = form.querySelector("input[name='file_attach[]']").files;

      const errorMessageElement = form.querySelector('.error-message');
      const sentMessageElement = form.querySelector('.sent-message');
      errorMessageElement.style.display = 'none';
      sentMessageElement.style.display = 'none';

      if (!name) {
        displayError(form, 'Full Name is required.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        displayError(form, 'Please enter a valid email address.');
        return;
      }
      if (!/^\+?[0-9\s\-]{10,15}$/.test(phone)) {
        displayError(form, 'Please enter a valid phone number.');
        return;
      }
      if (!message) {
        displayError(form, 'Message cannot be empty.');
        return;
      }
      if (files.length > 0) {
        const allowedExtensions = /\.(doc|pdf)$/i;
        const maxSize = 5 * 1024 * 1024; // 5 MB
        for (const file of files) {
          if (!allowedExtensions.test(file.name)) {
            displayError(form, 'Only .doc or .pdf files are allowed.');
            return;
          }
          if (file.size > maxSize) {
            displayError(form, 'Each file must be smaller than 5 MB.');
            return;
          }
        }
      }


      form.querySelector('.loading').style.display = 'block';
      form.querySelector('button[type="submit"]').disabled = true;


      sendMail(form);
    });
  });

  function sendMail(form) {
    const params = {
      name: form.querySelector("input[name='name']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      message: form.querySelector("textarea[name='message']").value,
      files: form.querySelector("input[name='file_attach[]']").value,
    };


    emailjs.send("service_975uom8", "template_wisufk1", params).then(
      function (response) {
        console.log("Email sent successfully:", response);
        form.reset();
        form.querySelector('.loading').style.display = 'none';
        const sentMessageElement = form.querySelector('.sent-message');
        sentMessageElement.style.display = 'block';
        setTimeout(() => {
          sentMessageElement.style.display = 'none';
        }, 5000);
        form.querySelector('button[type="submit"]').disabled = false;
      },
      function (error) {
        console.error("Email sending failed:", error);
        displayError(form, 'There was an error sending your message. Please try again later.');
        form.querySelector('.loading').style.display = 'none';
        form.querySelector('button[type="submit"]').disabled = false;
      }
    );
  }

  function displayError(form, error) {
    const errorMessageElement = form.querySelector('.error-message');
    errorMessageElement.innerHTML = error;
    errorMessageElement.style.display = 'block';
    setTimeout(() => {
      errorMessageElement.style.display = 'none';
    }, 5000);
  }
})();
