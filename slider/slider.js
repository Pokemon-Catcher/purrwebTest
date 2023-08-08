const animationDuration = 400
const updateInterval = 5

const sliders=document.getElementsByClassName('slider');
for(let slider of sliders){
    let imageContainer=slider.getElementsByClassName('slider__image-container')[0]
    let images=slider.getElementsByClassName('slider__image')
    let first=images[0]
    let last=images[images.length-1]
    let pageButton=slider.getElementsByClassName('slider__footer__pageButton')[0]
    let footer=pageButton.parentElement
    for(let i=1;i<images.length;i++){
        let newPage=pageButton.cloneNode(true)
        newPage.setAttribute('page',i+1)
        footer.append(newPage)
    }
    pageButton.classList.add('slider__footer__pageButton_current')
    imageContainer.setAttribute('count',images.length)
    imageContainer.prepend(last.cloneNode(true))
    imageContainer.append(first.cloneNode(true))
    imageContainer.style.transform=`translateX(-100%)`
}

function handlerToPage(e){
    if(e.target.classList.contains('slider__footer__pageButton_current')) return;
    let page=parseInt(e.target.getAttribute("page"))
    slide(e,0,animationDuration,updateInterval,page)
}

function handlerPrevSlide(e){
    slide(e,1,animationDuration,updateInterval)
}
function handlerNextSlide(e){
    slide(e,-1,animationDuration,updateInterval)
}


function slide(event,direction,duration,updateInterval,page){
    let slider=event.target.parentElement.parentElement;
    imageContainer=slider.getElementsByClassName('slider__image-container')[0]
    if(imageContainer.getAttribute("busy")==1) return;
    let currentPage=slider.getElementsByClassName('slider__footer__pageButton_current')[0]
    console.log(currentPage)
    let count=parseInt(imageContainer.getAttribute('count'))
    imageContainer.setAttribute("busy", 1);
    let from=/[\-\.0-9]+/.exec(imageContainer.style.transform)
    from=(from && parseFloat(from[0])) || 0.0
    let to=0;
    currentPage.classList.remove('slider__footer__pageButton_current')
    if(page) {
        event.target.classList.add('slider__footer__pageButton_current')
        to=-page*100
    }
    else {
        to=parseFloat(from)+100.0*direction
        let nextPage;
        if(direction==-1){
            nextPage=currentPage.nextElementSibling
            if(!nextPage) nextPage=currentPage.parentElement.children[0]
        } else {
            nextPage=currentPage.previousElementSibling
            if(!nextPage) nextPage=currentPage.parentElement.children[count-1]
        }
        nextPage.classList.add('slider__footer__pageButton_current')
    }
    let start = Date.now()
    let interval=setInterval(()=>{
        let timePassed=Date.now() - start;
        imageContainer.style.transform=`translateX(${from+Math.pow(timePassed/duration,1.5)*(to-from)}%)`
        if (timePassed >= duration) {
            if(to>=0) imageContainer.style.transform=`translateX(${-count*100}%)`
            else if(to<-count*100) imageContainer.style.transform=`translateX(-100%)`
            else imageContainer.style.transform=`translateX(${to}%)`
            clearInterval(interval); 
            imageContainer.setAttribute("busy", 0);
            return;
          }
    },updateInterval)
}
