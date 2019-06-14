function initialize() {
    const body = document.querySelector('body');
    body.style.background = "black";
    body.style.color = "white";
    
    let formWrapper = createElement('div', 'formWrapper', 'row card-panel black');
    formWrapper.style.marginTop = '20px';
    let form = createForm();
    let heading = createElement('div', null, 'h1 center-align');
    heading.textContent = "Form";
    let submit = setSubmitButton();

    insertElement(body, formWrapper);
    insertElement(formWrapper, form);
    insertElement(form, heading);
    insertElement(heading, submit);
}

function createElement(eleType, id = null, className = null, name = null, type = null, required = true) {
    let ele = document.createElement(eleType);
    if (id !== null) ele.setAttribute('id', id);
    if (className !== null) ele.setAttribute('class', className);
    if (name !== null) ele.setAttribute('name', name);
    if (type !== null) ele.setAttribute('type', type);
    if (eleType == 'input' && required) ele.required = true;

    return ele;
}

function insertElement(parentNode, childNode) {
    parentNode.appendChild(childNode);
}
function createLabel(forId, textContent, className = null) {
    let label = document.createElement('label')
    label.setAttribute('for', forId);
    label.textContent = textContent;
    if (className !== null) label.setAttribute('class', 'active');
    return label;
}

function createForm() {
    let form = createElement('form', 'votingForm', 'col s12');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/');

    return form;
}

function setElectionName() {
    const form = document.querySelector('#votingForm');
    
    let electionNameWrapper = createElement('div', 'electionNameWrapper', 'row');
    let div = createElement('div', null, 'input-field col s6');
    let electionNameLabel = createLabel('electionName', 'Election Name : ', 'active');
    let electionName = createElement('input', 'electionName', 'validate', 'electionName', 'text');
    
    insertElement(form, electionNameWrapper);
    insertElement(electionNameWrapper, div);
    insertElement(div, electionNameLabel);
    insertElement(div, electionName);
    
    electionName.addEventListener('focus', createNumOfPost);
}
function createNumOfPost() {
    const electionNameWrapper = document.querySelector('#electionNameWrapper');
    let numOfPost = document.querySelector('#numOfPost');
    if (numOfPost === null) {
        let numOfPostLabel = createLabel('numOfPost', 'Number of Posts : ', 'active');
        numOfPost = createElement('input', 'numOfPost', 'validate', 'numOfPost', 'number');
        numOfPost.setAttribute('min', 1);
        numOfPost.setAttribute('value', 0);
        let div = createElement('div', null, 'input-field col s6');

        insertElement(electionNameWrapper, div);
        insertElement(div, numOfPostLabel);
        insertElement(div, numOfPost);

        numOfPost.addEventListener('change', createPost);
    }
}

function createPost() {
    const form = document.querySelector('#votingForm');
    let num = Number(document.querySelector('#numOfPost').value);
    let previous = document.querySelectorAll('.post').length;
    if (previous < num) {
        for (let i = previous + 1; i <= num; i++) {
        
            let cover = createElement('div', 'post' + i, 'post row');
            insertElement(form, cover);

            let div1 = createElement('div', null, 'col s12 card-panel black');
            insertElement(cover, div1);

            let div2 = createElement('div', 'postNameWrapper' + i, 'row');
            insertElement(div1, div2);

            let div3 = createElement('div', null, 'input-field col s4');
            let postNameLabel = createLabel('postName' + i, 'Post ' + i + ' : ', 'active');
            let postName = createElement('input', 'postName' + i, 'validate', 'post[]', 'text');
            insertElement(div2, div3);
            insertElement(div3, postNameLabel);
            insertElement(div3, postName);

            let div4 = createElement('div', null, 'input-field col s4');
            let numOfCandidatesLabel = createLabel('numOfCandidates' + i, 'Number of Candidates', 'active');
            let numOfCandidates = createElement('input', 'numOfCandidates' + i, 'validate', 'numOfCandidates[]', 'number');
            numOfCandidates.setAttribute('min', 2);
            numOfCandidates.setAttribute('value', 0);
            insertElement(div2, div4);
            insertElement(div4, numOfCandidatesLabel);
            insertElement(div4, numOfCandidates);
            
            let div5 = createElement('div', null, 'input-field col s4');
            let votingLimitLabel = createLabel('votingLimit' + i, 'voting Limit', 'active');
            let votingLimit = createElement('input', 'votingLimit' + i, 'validate', 'votingLimit[]', 'number');
            votingLimit.setAttribute('min', 1);
            votingLimit.setAttribute('value', 1);
            insertElement(div5, votingLimitLabel);
            insertElement(div5, votingLimit);
            insertElement(div2, div5);
            
            numOfCandidates.addEventListener('change', createCandidates);
            votingLimit.addEventListener('change', validateVotingLimit);

            let div6 = createElement('div', 'candidates' + i, 'row container card-panel black hoverable');
            insertElement(div1, div6);
            //div6.style.marginLeft = "250px";

        }
    } else if (previous > num && num >= 0) {
        for (let i = previous; i > num; i--) {
            let element = document.querySelector('#post' + i);
            element.parentNode.removeChild(element);
        }
    }   
}

function createCandidates(e) {
    let num = Number(e.target.value);
    let idName = e.target.id;
    let j = idName[idName.length - 1];
    let previous = document.querySelectorAll('#candidates' + j + ' .candidate').length;
    let div1 = document.querySelector('#candidates' + j);
    if (previous < num) {
        for (let i = previous + 1; i <= num; i++) {
            let div2 = createElement('div', 'candidate' + j + i, 'candidate input-field');
            insertElement(div1, div2);
            
            let candidateNameLabel = createLabel('candidateName' + j + i, 'Candidate ' + i + ' : ', 'active');
            insertElement(div2, candidateNameLabel);
    
            let candidateName = createElement('input', 'candidateName' + j + i, 'validate', 'candidateName[' + j + '][]', 'text');
            insertElement(div2, candidateName);
        }
    } else if (previous > num && num >= 0) {
        for (let i = previous; i > num; i--) {
            let element = document.querySelector('#candidate' + j + i);
            element.parentNode.removeChild(element);
        }
    }
}

function validateVotingLimit(e) {
    let num = Number(e.target.value);
    let idName = e.target.id;
    let j = idName[idName.length - 1];
    let numOfCandidates = document.querySelector('#numOfCandidates' + j).value;
    if (num >= numOfCandidates) {
        e.target.value = numOfCandidates - 1;
        if (numOfCandidates - 1 === -1) {
            e.target.value = 0;
        }
    }
}

function setSubmitButton() {
    let button = createElement('button', 'submit', 'btn-large btn-floating waves-effect waves-light right', 'submit', 'submit');
    button.textContent = "===>";
    return button;
}

initialize();
setElectionName();
setSubmitButton();



// function initialize() {
//     const body = document.querySelector('body');
    
//     let formWrapper = createElement('div', 'formWrapper', 'formWrapper row');
//     let form = createForm();
//     let inputSection = createElement('div', 'inputSection', 'inputSection row');
//     let submitSection = createElement('div', 'submitSection', 'submitSection');
    
//     insertElement(body, formWrapper);
//     insertElement(formWrapper, form);
//     insertElement(form, inputSection);
//     insertElement(form, submitSection);
    
//     return {
//         formWrapper,
//         form,
//         inputSection,
//         submitSection
//     };
// }

// function createElement(eleType, id = null, className = null, name = null, type = null, required = true) {
//     let ele = document.createElement(eleType);
//     if (id !== null) ele.setAttribute('id', id);
//     if (className !== null) ele.setAttribute('class', className);
//     if (name !== null) ele.setAttribute('name', name);
//     if (type !== null) ele.setAttribute('type', type);
//     if (eleType == 'input' && required) ele.required = true;

//     return ele;
// }

// function insertElement(parentNode, childNode) {
//     parentNode.appendChild(childNode);
// }
// function createLabel(forId, textContent, className = null) {
//     let label = document.createElement('label')
//     label.setAttribute('for', forId);
//     label.textContent = textContent;
//     if (className !== null) label.setAttribute('class', 'active');
//     return label;
// }

// function createForm() {
//     let form = createElement('form', 'form', 'form col s12');
//     form.setAttribute('method', 'POST');
//     form.setAttribute('action', '/');

//     return form;
// }

// function setElectionName() {
    
//     let electionNameWrapper = createElement('fieldset', 'electionNameWrapper', 'col s12');
//     let electionNameLabel = createLabel('electionName', 'Election Name : ');
//     let electionName = createElement('input', 'electionName', null, 'electionName', 'text');
//     let div = createElement('div', null, 'input-field col s6');
    
//     insertElement(inputSection, electionNameWrapper);
//     insertElement(electionNameWrapper, div);
//     insertElement(div, electionNameLabel);
//     insertElement(div, electionName);
    
//     electionName.addEventListener('focus', createNumOfPost);

//     return electionNameWrapper;
// }
// function createNumOfPost() {
//     let numOfPost = document.querySelector('#numOfPost');
//     if (numOfPost === null) {
//         let numOfPostLabel = createLabel('numOfPost', 'Number of Posts : ', 'active');
//         numOfPost = createElement('input', 'numOfPost', null, 'numOfPost', 'number');
//         numOfPost.setAttribute('min', 1);
//         numOfPost.setAttribute('value', 0);
//         let div = createElement('div', null, 'input-field col s6');

//         insertElement(electionNameWrapper, div);
//         insertElement(div, numOfPostLabel);
//         insertElement(div, numOfPost);

//         numOfPost.addEventListener('change', createPost);
//     }
// }

// function createPost() {
//     let num = Number(document.querySelector('#numOfPost').value);
//     let previous = document.querySelectorAll('.post').length;
//     if (previous < num) {
//         for (let i = previous + 1; i <= num; i++) {
        
//             let fieldset = createElement('fieldset', 'post' + i, 'post col s12');
//             insertElement(inputSection, fieldset);

//             let div1 = createElement('div', 'postNameWrapper' + i);
//             insertElement(fieldset, div1);

//             let postNameLabel = createLabel('postName' + i, 'Post ' + i + ' : ');
//             insertElement(div1, postNameLabel);

//             let postName = createElement('input', 'postName' + i, null, /*'postName' + i + */'post[]', 'text');
//             insertElement(div1, postName);

//             let numOfCandidatesLabel = createLabel('numOfCandidates' + i, 'Number of Candidates');
//             insertElement(div1, numOfCandidatesLabel);

//             let numOfCandidates = createElement('input', 'numOfCandidates' + i, null, /*'numOfCandidates' + i*/ 'numOfCandidates[]', 'number');
//             insertElement(div1, numOfCandidates);
//             numOfCandidates.setAttribute('min', 2);
//             numOfCandidates.setAttribute('value', 0);

//             let votingLimitLabel = createLabel('votingLimit' + i, 'voting Limit');
//             insertElement(div1, votingLimitLabel);

//             let votingLimit = createElement('input', 'votingLimit' + i, null, /*'votingLimit' + i*/ 'votingLimit[]', 'number');
//             insertElement(div1, votingLimit);
//             votingLimit.setAttribute('min', 1);
//             votingLimit.setAttribute('value', 1);

//             numOfCandidates.addEventListener('change', createCandidates);
//             votingLimit.addEventListener('change', validateVotingLimit);
//             let div2 = createElement('div', 'candidates' + i);
//             insertElement(fieldset, div2);

//         }
//     } else if (previous > num && num >= 0) {
//         for (let i = previous; i > num; i--) {
//             let element = document.querySelector('#post' + i);
//             element.parentNode.removeChild(element);
//         }
//     }   
// }

// function createCandidates(e) {
//     let num = Number(e.target.value);
//     let idName = e.target.parentNode.id;
//     let j = idName[idName.length - 1];
//     let previous = document.querySelectorAll('#candidates' + j + ' .candidate').length;
//     console.log(previous);
//     let div2 = document.querySelector('#candidates' + j);
//     if (previous < num) {
//         for (let i = previous + 1; i <= num; i++) {
//             let div = createElement('div', 'candidate' + j + i, 'candidate');
//             insertElement(div2, div);
            
//             let candidateNameLabel = createLabel('candidateName' + j + i, 'Candidate ' + i + ' : ');
//             insertElement(div, candidateNameLabel);
    
//             let candidateName = createElement('input', 'candidateName' + j + i, null, /*'candidateName' + j + i*/'candidateName[' + j + '][]', 'text');
//             insertElement(div, candidateName);
//         }
//     } else if (previous > num && num >= 0) {
//         for (let i = previous; i > num; i--) {
//             let element = document.querySelector('#candidate' + j + i);
//             element.parentNode.removeChild(element);
//         }
//     }
// }

// function validateVotingLimit(e) {
//     let num = Number(e.target.value);
//     let idName = e.target.parentNode.id;
//     let j = idName[idName.length - 1];
//     let numOfCandidates = document.querySelector('#numOfCandidates' + j).value;
//     if (num >= numOfCandidates) {
//         e.target.value = numOfCandidates - 1;
//     }
// }

// function setSubmitButton() {
//     let button = createElement('button', 'submit', 'btn btn-primary btn-lg', 'submit', 'submit');
//     button.textContent = "Submit";
//     insertElement(submitSection, button);
// }

// const { formWrapper, form, inputSection, submitSection } = initialize();
// const electionWrapper = setElectionName();
// setSubmitButton();