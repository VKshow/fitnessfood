window.addEventListener('DOMContentLoaded', () => {
    //tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');


    function hideTabContent (){
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }


    function showTabContent (i = 0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }




    hideTabContent();
    showTabContent();



    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) => {
                if(target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });



//timer

const deadline = '2023-09-09';

function getTimeRemaining(endtime){
    const t = Date.parse(endtime) - Date.parse(new Date()), 
        days = Math.floor(t / ((1000 * 60 * 60) * 24)),
        hours = Math.floor((t / 1000 * 60 * 60) % 24),
        minutes = Math.floor((t / 1000 / 60) % 60),
        seconds = Math.floor((t / 1000) % 60);

    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}


    function getZero(num){
        if(num >=0 && num < 10){
            return `0${num}`;
        }else{
            return num;
        }
    }

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock(){
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0){
                clearInterval(timeInterval);
            }

        }
    }
    setClock('.timer', deadline);



    //MODAL

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');
        

        function openModal(){
            
                modal.classList.add('show');
                modal.classList.remove('hide');
                document.body.style.overflow = 'hidden';
                clearInterval(modalTimerId);
        }

        modalTrigger.forEach(btn => {
            btn.addEventListener('click', openModal);
        });

        

        function closeModal(){
            modal.classList.add('hide');
            modal.classList.remove('show');
                document.body.style.overflow = '';      
        }

        


        modal.addEventListener('click', (e) => {
            if(e.target === modal || e.target.getAttribute('data-close') == ""){
                closeModal();
            };
        });

        document.addEventListener('keydown', (e) => {
            if(e.code === "Escape" && modal.classList.contains('show')){
                closeModal();
            }
        });

        const modalTimerId = setTimeout(openModal, 100000);

        function showModalByScroll(){
            if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1){
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
            }
        }

        window.addEventListener('scroll', showModalByScroll);


        // use classes for cards

        class MenuCard{
            constructor(src, alt, title, descr, price, parentSelector, ...classes){
                this.src = src;
                this.alt = alt;
                this.title = title;
                this.descr = descr;
                this.price = price;
                this.classes = classes ;
                this.parent = document.querySelector(parentSelector);
                this.transfer = 1;
                this.changeToUAH();
            }

            changeToUAH(){
                this.price = this.price / this.transfer;
            }

            render(){
                const element = document.createElement('div');

                if(this.classes.length === 0){
                    this.element = 'menu__item';
                    element.classList.add(this.element);
                } else{
                    this.classes.forEach(className => element.classList.add(className));
                }

                
                element.innerHTML = `
                
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">
                        ${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Price:</div>
                        <div class="menu__item-total"><span>${this.price}</span> usd/day</div>
                    </div>
                
                `;
                this.parent.append(element);
            }
        }

        new MenuCard(
            "img/tabs/vegy.jpg" ,
            "vegy",
            'Menu "Fitness"',
            'Menu "Fitness" is a new approach to cooking: more fresh vegetables and fruits. Product of active and healthy people. This is a brand new product with the best price and high quality!',
            50,
            '.menu .container',
            'menu__item'
        ).render();

        new MenuCard(
            "img/tabs/elite.jpg" ,
            "elite",
            'Menu "Premium"',
            'In the “Premium” menu, we use not only beautiful packaging design, but also high-quality execution of dishes. Red fish, seafood, fruits - a restaurant menu without going to a restaurant!',
            70,
            '.menu .container',
            'menu__item'
        ).render();

        new MenuCard(
            "img/tabs/post.jpg" ,
            "post",
            'Menu "Lenten"',
            'The “Lenten” menu is a careful selection of ingredients: the complete absence of animal products, milk from almonds, oats, coconut or buckwheat, the right amount of protein from tofu and imported vegetarian steaks.',
            100,
            '.menu .container',
            'menu__item'
        ).render();

        //forms

        const forms = document.querySelectorAll('form');

        const message = {
            loading: 'img/form/spinner.svg',
            success: "thanks! we'll call you back soon",
            failure: 'something goes wrong..'
        };

        forms.forEach(item => {
            postData(item);
        });

        function postData (form){
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
                `;
                
                form.insertAdjacentElement('afterend', statusMessage);

                const request = new XMLHttpRequest();
                request.open('POST', 'server.php');

                request.setRequestHeader('Content-type', 'application/json');

                const formData = new FormData(form);

                const object = {};
                formData.forEach(function (value, key){
                    object[key] = value;
                });

                const json = JSON.stringify(object);

                request.send(json);

                request.addEventListener('load', () => {
                    if( request.status === 200){
                        console.log(request.response);
                        showThanksModal(message.success);
                        statusMessage.remove();
                        form.reset();
                        
                      
                    } else {
                        showThanksModal(message.failure);
                    }
                });
            });
        }


        function showThanksModal(message){
            const prevModalDialog = document.querySelector('.modal__dialog');
            

            prevModalDialog.classList.add('hide');
            prevModalDialog.classList.remove('show');
            openModal();

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
                <div class = "modal__content">
                    <div class = "modal__close" data-close>x</div>
                    <div class = "modal__title">${message}</div>
                </div>
            `;

            document.querySelector('.modal').append(thanksModal);
            setTimeout(() => {
                thanksModal.remove();
                prevModalDialog.classList.remove('hide');
                prevModalDialog.classList.add('show');
                
                closeModal();
            },4000);
        }
});