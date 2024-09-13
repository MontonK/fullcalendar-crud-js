document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'th',
        selectable: true,
        editable: true,
        events: [],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'วันนี้',
            month: 'เดือน',
            week: 'สัปดาห์',
            day: 'วัน'
        },
        customButtons: {
            prev: {
                text: '«',
                click: function() {
                    calendar.prev();
                }
            },
            next: {
                text: '»',
                click: function() {
                    calendar.next();
                }
            }
        },
        // ปรับแต่งการเรนเดอร์กิจกรรมด้วย Tailwind CSS
        eventDidMount: function(info) {
            info.el.classList.add(
                'bg-blue-500',   
                'text-green-800', 
                'rounded',         
                'p-2',             
                'shadow-md'        
            );
        },
        // ปรับแต่งวันที่ปัจจุบันด้วย Tailwind CSS
        dayCellDidMount: function(info) {
            if (info.date.toDateString() === new Date().toDateString()) {
                info.el.classList.add(
                    'bg-blue-100',  
                    'text-blue-800',
                    'font-bold'      
                );
            }
        },
        // ฟังก์ชันการเลือกวันที่
        select: function(info) {
            showModal('กรุณาใส่ชื่อกิจกรรม:', info, calendar);
            calendar.unselect();
        },
        // ฟังก์ชันการคลิกที่กิจกรรม
        eventClick: function(info) {
            showEventDetails(info.event, calendar);
        },
        eventDrop: function(info) {
            alert('กิจกรรมถูกย้ายไปยัง ' + info.event.start.toISOString());
        }
    });

    calendar.render();
});

// แสดง Modal เพื่อสร้างกิจกรรมใหม่
function showModal(message, info, calendar) {
    let modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50', 'z-50');
    
    let modalContent = document.createElement('div');
    modalContent.classList.add('bg-white', 'p-6', 'rounded', 'shadow-lg', 'w-1/3');
    modalContent.innerHTML = `
        <p class="mb-4 text-lg font-semibold">${message}</p>
        <input type="text" id="eventTitle" class="border rounded w-full px-3 py-2 mb-4" placeholder="ชื่อกิจกรรม" />
        <div class="flex justify-end">
            <button class="bg-gray-500 text-white px-4 py-2 rounded mr-2" id="cancelButton">ยกเลิก</button>
            <button class="bg-blue-500 text-white px-4 py-2 rounded" id="saveButton">บันทึก</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.getElementById('cancelButton').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    document.getElementById('saveButton').addEventListener('click', function() {
        let title = document.getElementById('eventTitle').value;
        if (title) {
            calendar.addEvent({
                title: title,
                start: info.startStr,
                end: info.endStr,
                allDay: info.allDay
            });
            document.body.removeChild(modal);
        } else {
            alert('กรุณาใส่ชื่อกิจกรรม');
        }
    });
}

// แสดงรายละเอียดกิจกรรมเมื่อคลิกที่กิจกรรม
function showEventDetails(event, calendar) {
    let modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50', 'z-50');
    
    let modalContent = document.createElement('div');
    modalContent.classList.add('bg-white', 'p-6', 'rounded', 'shadow-lg', 'w-1/3');
    modalContent.innerHTML = `
        <p class="mb-4 text-lg font-semibold">รายละเอียดกิจกรรม</p>
        <p><strong>ชื่อกิจกรรม:</strong> ${event.title}</p>
        <p><strong>วันเริ่มต้น:</strong> ${event.start.toISOString().slice(0, 10)}</p>
        <p><strong>วันสิ้นสุด:</strong> ${event.end ? event.end.toISOString().slice(0, 10) : 'ไม่มี'}</p>
        <div class="flex justify-end mt-4">
            <button class="bg-blue-500 text-white px-4 py-2 rounded mr-2" id="editButton">แก้ไข</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded mr-2" id="deleteButton">ลบ</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" id="closeButton">ปิด</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.getElementById('editButton').addEventListener('click', function() {
        editEvent(event, calendar);
        document.body.removeChild(modal);
    });

    document.getElementById('deleteButton').addEventListener('click', function() {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้?')) {
            event.remove();
            document.body.removeChild(modal);
        }
    });

    // ปุ่มปิดโมดัล
    document.getElementById('closeButton').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}

// แก้ไขกิจกรรม
function editEvent(event, calendar) {
    let modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50', 'z-50');

    let modalContent = document.createElement('div');
    modalContent.classList.add('bg-white', 'p-6', 'rounded', 'shadow-lg', 'w-1/3');
    modalContent.innerHTML = `
        <p class="mb-4 text-lg font-semibold">แก้ไขกิจกรรม</p>
        <input type="text" id="editTitle" class="border rounded w-full px-3 py-2 mb-4" value="${event.title}" />
        <div class="flex justify-end">
            <button class="bg-gray-500 text-white px-4 py-2 rounded mr-2" id="cancelEditButton">ยกเลิก</button>
            <button class="bg-blue-500 text-white px-4 py-2 rounded" id="saveEditButton">บันทึก</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.getElementById('cancelEditButton').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    document.getElementById('saveEditButton').addEventListener('click', function() {
        let newTitle = document.getElementById('editTitle').value;
        if (newTitle) {
            event.setProp('title', newTitle);
            document.body.removeChild(modal);
        } else {
            alert('กรุณาใส่ชื่อกิจกรรม');
        }
    });
}
