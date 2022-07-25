const employeeBtn = document.getElementById("addEmployee")
const empModalBg = document.querySelector('.modal-background');
const empModal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const closeModalBtn = document.querySelector(".modal-close");
const cancelModalForm = document.querySelector(".close-form");
const fileInput = document.querySelector('#file input[type=file]');
const submitEmpForm = document.querySelector('#submit-emp-form');
var pageNumber = 1;
const prev_page = document.querySelector('.pagination-previous');
const next_page = document.querySelector('.pagination-next');


// Retrieve employee data
const get_Employees = async () => {
    const response = await fetch(`https://emplistapi-258220.appspot.com/?pageNumber=${pageNumber}&pageSize=6`);
    const data = await response.json(); //extract JSON from the http response
    populate_employees(data)
  }


// Load next pages employee data
const next_page_load = async () => {
    pageNumber += 1;

    const response = await fetch(`https://emplistapi-258220.appspot.com/?pageNumber=${pageNumber}&pageSize=6`);
    const data = await response.json(); //extract JSON from the http response
    console.log(data)
    if (data.length > 0){
        populate_employees(data)
    }
    else{
        No_more_employees()
    }
}

//load previous page employee data
const prev_page_load = async () => {
    if (pageNumber>1) {
        pageNumber-=1;
        const response = await fetch(`https://emplistapi-258220.appspot.com/?pageNumber=${pageNumber}&pageSize=6`);
        const data = await response.json(); //extract JSON from the http response
        //check if page has at lease one employee's data
        if (data.length > 0){
            populate_employees(data)
        }
        else{
            No_more_employees()
        }
    }
}

//Load employee data on page change
prev_page.addEventListener('click',prev_page_load);
next_page.addEventListener('click',next_page_load);

//display uploaded file name
fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
        const fileName = document.querySelector('#file .file-name');
        fileName.textContent = fileInput.files[0].name;
    }
}

//Modal event listenders
employeeBtn.addEventListener('click',open_modal);
cancelModalForm.addEventListener('click',close_modal);
closeModalBtn.addEventListener('click',close_modal);
submitEmpForm.addEventListener('click',add_employee_form);

/*
The code below loads the employee data into an html list of boxes.
Each box representing a single employee
*/
function populate_employees(data) {
    const ul = document.getElementById('employees');
    ul.innerHTML = "";
    const list = document.createDocumentFragment();

    data.map(function (employee) {
        if (employee_data_check(employee.name.first,employee.name.last,employee.jobTitle)){
            let li = document.createElement('li');
            li.classList.add("box");
            li.classList.add("is-size-6-desktop");
            li.classList.add("is-size-6-desktop");
    
            let media = document.createElement('article');
            media.classList.add("media");
            li.appendChild(media)

            add_employee_picture(media,employee);
            add_employee_description(media,employee)
            list.appendChild(li);
        }
        });

        ul.appendChild(list);
}

//Adds the employee photo to the employee box
function add_employee_picture(media,employee){

    let employee_picture = document.createElement('figure');
    employee_picture.classList.add("image");
    employee_picture.classList.add("is-64x64");
    employee_picture.classList.add("media-left")

    let img = document.createElement('img');
    img.src = `${employee.photoURL}`
    img.alt = "employee picture"
    img.classList.add("is-rounded");
    img.classList.add("list-image");

    employee_picture.appendChild(img)
    media.appendChild(employee_picture);
}

//Adds the employee description to the employee box
function add_employee_description(media,employee){
    let br = document.createElement("br");

    let media_content = document.createElement("div");
    media_content.classList.add("mea-content");

    let content = document.createElement("div");
    content.classList.add("content");

    let description = document.createElement("p");
    description.classList.add("p");

    let name = document.createElement("strong");
    name.textContent = `${employee.name.first} ${employee.name.last}`
    let job = document.createElement("div");
    job.textContent = `${employee.jobTitle}`

    media_content.appendChild(content)
    content.appendChild(description)
    description.appendChild(name)
    description.appendChild(br)
    description.appendChild(job)
    media.appendChild(media_content)
}


function close_modal(){
    empModal.classList.remove('is-active');
}

function open_modal(){
    empModal.classList.add('is-active');
}

//Form for adding an employee
function add_employee_form(){
    var elements = document.getElementById("new_employee_form").getElementsByTagName("input");
    var obj ={};
    for(var i = 0 ; i < elements.length ; i++){
        var item = elements.item(i);
        // validating form
        obj[item.name] = item.value;
        item.value = "";
    }
    if (employee_data_check(obj.first_name,obj.last_name,obj.job_title)){
        console.log(obj)
        alert("Employee added");
        close_modal()
        return(JSON.stringify(obj));
    }
    else{
        alert("Form invalid");
        return false;
    }
    
}

// Displays message to show that the page has no more employees
function No_more_employees(){
    const ul = document.getElementById('employees');
    ul.innerHTML = "No more employees";
}

//Check to see if all valid information is entered for the employee
function employee_data_check(f_name,l_name,job){
    if (f_name && l_name && job){
        return true
    }
    else{
        return false
    }
}