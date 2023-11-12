(() => {
    let state = {
        district: {},
    }
    let action = {
        addDistrictToState(dist, name) {
            mutation.addDistrict(dist, name)
            changeLabelCounter(getter.getNamesCount())
            labelCounterVisible()
        },
        removeDistrictToState(dist, name) {
            mutation.removeDistrictName(dist, name)
            changeLabelCounter(getter.getNamesCount())
            labelCounterVisible()
        }
    }
    let mutation = {
        addDistrict(dist, name) {
            if (state?.district?.[dist])
                state.district[dist].push(name)
            else {
                state.district[dist] = [name]
            }
        },
        removeDistrictName(dist, name) {
            if (state.district[dist])
                state.district[dist] = state.district[dist].filter(item => item !== name);
        }
    }
    let getter = {
        getNamesCount() {
            return Object.values(state.district).reduce((acc, item) => acc + item.length, 0)
        },
        getDisctrictName(dist) {
            return state.district[dist]
        }
    }

    let radios = document.querySelectorAll('input[name="radioChoose"]');
    radios.forEach(item => {
        item.addEventListener('change', setDropList)
    })

   function checkScroll(){
    let rootElement = document.getElementById('root-drop-list')
       if(rootElement.scrollHeight > rootElement.clientHeight) {
           rootElement.onscroll = () => {
               if(rootElement.scrollHeight - rootElement.scrollTop < rootElement.clientHeight) {
                   document.querySelector('.drop-down-menu--shadow').style.display = 'none'
               }
               else document.querySelector('.drop-down-menu--shadow').style.display = 'block'
           }
       }
    }

    function isChecked(node) {
        let nodes = getter.getDisctrictName(document.querySelector('input[name="radioChoose"]:checked'));
        if (nodes) {
            for (let item = 0; item < nodes.length; item++) {
                if (nodes[item] === node)
                    return true
            }
        }
        return false
    }

    function createNode(node) {
        let rootElement = document.getElementById('root-drop-list')
        let div = document.createElement("div")
        let input = document.createElement('input')
        let label = document.createElement("label");
        let span = document.createElement("span")
        label.htmlFor = node;
        label.textContent = node;
        label.appendChild(span);

        div.classList.add('drop-list--content')
        input.id = node
        input.type = 'checkbox'
        input.name = 'content'
        input.value = node;
        input.checked = isChecked(node)
        input.addEventListener("change", changeElementStatus)

        div.appendChild(input)
        div.appendChild(label)
        rootElement.appendChild(div);
    }

    function createLabel(node) {
        let rootNode = document.querySelector('.button-menu')
        let label = document.createElement("label")
        label.textContent = node.value
        label.dataset.name = node.value
        label.dataset.value = document.querySelector('input[name="radioChoose"]:checked').value
        label.addEventListener('click', () => {
            removeLabel(node)
            node.checked = false
        })
        rootNode.appendChild(label)
        action.addDistrictToState(label.dataset.value, label.dataset.name)
    }

    function removeLabel(node) {
        let rootNode = document.querySelector('.button-menu')
        let removeNode = document.querySelector(`[data-name = "${node.value}"]`)
        rootNode.removeChild(removeNode);
        action.removeDistrictToState(removeNode.dataset.value, removeNode.dataset.name)
    }

    function changeElementStatus() {
        if (this.checked) {
            createLabel(this)
        } else
            removeLabel(this)
    }

    function changeLabelCounter(count) {
        document.querySelector('.drop-list').dataset.set = count
    }

    function labelCounterVisible() {
        if (getter.getNamesCount()) {
            document.querySelector('.button-menu').classList.add('active')
            document.querySelector('.drop-list').classList.add('active')
        } else {
            document.querySelector('.button-menu').classList.remove('active')
            document.querySelector('.drop-list').classList.remove('active')
        }
    }

    function setDropList() {


        let rootElement = document.getElementById('root-drop-list')
        switch (document.querySelector('input[type="radio"]:checked').value) {
            case 'ЖК': {
                rootElement.innerHTML = '';
                readTextFile("text.json", function (text) {
                    let data = JSON.parse(text);
                    data.lcd.forEach(item => {
                        createNode(item);
                    })
                    checkScroll()
                });
                break;
            }
            case 'округ': {
                rootElement.innerHTML = '';
                readTextFile("text.json", function (text) {
                    let data = JSON.parse(text);
                    data.district.forEach(item => {
                        createNode(item);
                    })
                    checkScroll()
                });
                break;
            }
            case 'район': {
                rootElement.innerHTML = '';
                readTextFile("text.json", function (text) {
                    let data = JSON.parse(text);
                    data.area.forEach(item => {
                        createNode(item);
                    })
                    checkScroll()
                });
                break;
            }
            case 'метро': {
                rootElement.innerHTML = '';
                readTextFile("text.json", function (text) {
                    let data = JSON.parse(text);
                    data.metro.forEach(item => {
                        createNode(item);
                    })
                    checkScroll()
                });
                break;
            }
        }

    }

    setDropList();

    function readTextFile(file, callback) {
        let rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }
})()