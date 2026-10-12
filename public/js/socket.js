const socket = io();

const servicesList = document.getElementById("services-list");
const availabilityList = document.getElementById("availability-list");
const bookingsList = document.getElementById("bookings-list");
const createForm = document.getElementById("create-service-form");
const formMsg = document.getElementById("form-msg");

const availableText = (available) => (available ? "Disponible" : "No disponible");

const serviceCardHtml = (service, withToggle) => {
    const id = service._id || service.id;
    const toggle = withToggle
        ? `<button class="toggle-available" data-id="${id}" data-available="${service.available}">Cambiar disponibilidad</button>`
        : "";

    return `
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <p><strong>Duración:</strong> ${service.duration} min</p>
        <p><strong>Precio:</strong> $${service.price}</p>
        <p><strong>Categoría:</strong> ${service.category}</p>
        <p class="badge" data-available="${service.available}">${availableText(service.available)}</p>
        ${toggle}
    `;
};

const removeEmptyMsg = (list, emptyId) => {
    const empty = document.getElementById(emptyId);
    if (empty) {
        empty.remove();
    }
};

const upsertServiceCard = (list, service, withToggle) => {
    if (!list) return;

    const id = service._id || service.id;
    let card = list.querySelector(`[data-id="${id}"]`);

    if (!card) {
        removeEmptyMsg(list, "empty-services");
        card = document.createElement("article");
        card.className = "card service-card";
        card.dataset.id = id;
        list.prepend(card);
    }

    card.innerHTML = serviceCardHtml(service, withToggle);
};

socket.on("serviceCreated", (service) => {
    upsertServiceCard(servicesList, service, false);
    upsertServiceCard(availabilityList, service, true);
});

socket.on("serviceUpdated", (service) => {
    upsertServiceCard(servicesList, service, false);
    upsertServiceCard(availabilityList, service, true);
});

socket.on("bookingCreated", (booking) => {
    if (!bookingsList) return;

    removeEmptyMsg(bookingsList, "empty-bookings");

    const card = document.createElement("article");
    card.className = "card booking-card";
    card.dataset.id = booking._id;
    const dateText = new Date(booking.date).toLocaleDateString("es-AR");
    const servicesCount = booking.service?.length || 0;

    card.innerHTML = `
        <p><strong>Cliente:</strong> ${booking.clientName}</p>
        <p><strong>Email:</strong> ${booking.email || "-"}</p>
        <p><strong>Fecha:</strong> ${dateText}</p>
        <p><strong>Hora:</strong> ${booking.time || "-"}</p>
        <p><strong>Estado:</strong> ${booking.status}</p>
        <p><strong>Servicios en la reserva:</strong> ${servicesCount}</p>
    `;
    bookingsList.prepend(card);
});

if (createForm) {
    createForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = new FormData(createForm);
        const body = {
            name: data.get("name"),
            description: data.get("description"),
            price: Number(data.get("price")),
            duration: Number(data.get("duration")),
            category: data.get("category"),
            available: data.get("available") === "on"
        };

        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const json = await res.json();

            if (!res.ok) {
                formMsg.textContent = json.message || "No se pudo crear";
                return;
            }

            formMsg.textContent = "Listo, se creó el servicio";
            createForm.reset();
            createForm.available.checked = true;
        } catch (error) {
            formMsg.textContent = "Error de red";
        }
    });
}

document.addEventListener("click", async (event) => {
    const btn = event.target.closest(".toggle-available");
    if (!btn) return;

    const id = btn.dataset.id;
    const current = btn.dataset.available === "true";

    try {
        await fetch(`/api/services/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ available: !current })
        });
    } catch (error) {
        console.error("no pude cambiar la disponibilidad", error);
    }
});
