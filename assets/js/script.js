window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
        $('nav').addClass('shadow-sm')
    } else {
        $('nav').removeClass('shadow-sm')
    }
})

$(document).ready(function () {
    $(document).click(function (event) {
        var clickover = $(event.target);
        var _opened = $(".navbar-collapse").hasClass("show");
        if (_opened === true && !clickover.hasClass("navbar-toggler")) {
            $("button.navbar-toggler").click();
        }
    });
});

$.ajax({
    type: "get",
    url: "https://applications.rizkykurniawan.id/api/projects",
    data: {},
    dataType: "json",
    success: function (response) {
        if (response.code === 200) {
            let projects = response.data.projects
            projects.forEach((project) => {
                let tag = ""
                project.tags.forEach((tagItem) => {
                    tag += `<span class="badge bg-dark me-1">${tagItem}</span>`
                })

                let projectItem = `
                    <div class="col-lg-6 col-md-4 mb-3">
                        <div class="card h-100">
                            <img src="${project.pictures[0]}" alt=""
                                class="card-img-top w-100 img-fluid">
                            <div class="card-body">
                                <h5>${project.title}</h5>
                                <div>
                                    ${tag}
                                </div>
                                <p>${project.description}</p>
                            </div>
                        </div>
                    </div>`

                $("#row-projects").append(projectItem)
            })
        }
    }
})

$(document).ready(function (e) {
    let contactForm = $("#contact-form")
    let contactFormButton = $("#contact-form-button")
    let alert = $("#alert")

    contactForm.on("submit", function (evt) {
        evt.preventDefault()
        let data = {};
        $.each(contactForm.serializeArray(), function (i, field) {
            data[field.name] = field.value
        })
        $.ajax({
            type: "post",
            url: "https://applications.rizkykurniawan.id/api/contact-form",
            data: data,
            dataType: "json",
            beforeSend: function () {
                grecaptcha.reset()
                contactFormButton.addClass("disabled")
                contactFormButton.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...`)
            },
            complete: function () {
                contactFormButton.removeClass("disabled")
                contactFormButton.html("Send")
            },
            success: function (response) {
                contactFormButton.removeClass("disabled")
                contactFormButton.html("Send")
                if (response.code === 201) {
                    contactForm.trigger("reset")
                    alert.html(`
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            Pesan anda telah dikirim.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`
                    )
                }
            },
            error: function (xhr) {
                contactFormButton.removeClass("disabled")
                contactFormButton.html("Send")
                alert.html(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            ${xhr.responseJSON.error}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`
                )
            }
        });
    })
})