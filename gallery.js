$(document).ready(function() {
    var gallery = "gallery";
	var galleryLeft = "galleryLeft";
	var galleryRight = "galleryRight";
	var arrow = "arrow";
    var viewer = "viewer";
    var viewerArrow = "arrow";
    var viewerImage = "viewerImage";
    var classAppend = ".";
    var visibleImageClass = ".visible";
	var visibleImageName = "visible";
    var visibleSliderClass = ".current";
	var visibleSliderClassName = "current";
    var sliderElements = "sliderElements";
	var grabberClicked = "clicked";
	var grabber = "grabber";
	var sliderArrow = "slider";
    var leftArrow = "left";
    var fadeSpeed = 'slow';
	var elementFadeSpeed = 'fast';
	var fadeable = "fadeable";
	var info = "info";
	var infoHolder = "infoHolder";
	var window = "sliderWindow";
	var grabberSpeed = 'fast';
	var sliderSpeed = 'fast';
	var sliderLeft = "sliderLeft";
	var sliderRight = "sliderRight";
	var sliderEasing = 'swing';
	var TextArray = [];
	var startingImage = 0;

	init();
    var viewerArrows = $(classAppend + viewerArrow);
	
	function init(){
		var gallerys = $(classAppend + gallery);
		$(gallerys).each(function(index, el){
			var firstImage = $(el).find(classAppend + sliderElements).find("img").get(startingImage);
			$(el).find(classAppend + viewerImage).each(function(i, e){
				var img = $(e).find("img");
				var parallelSlider = $(el).find(classAppend + sliderElements).find("img").get(i + startingImage);
				img.attr("src", $(parallelSlider).attr("src"));
				
				if(i == 0)
					$(e).addClass(visibleImageName);
			});
			$(firstImage).addClass(visibleSliderClassName);
			var infoEl = $(el).find(classAppend + info);
			infoEl.html( getText(firstImage));
			
			
		});
		
	}
	
	$(classAppend + viewer).mouseenter(function(){
		//main fading
		$(this).find(classAppend + fadeable).fadeIn(elementFadeSpeed);
		var galleryParent = $(this);
		var top = $(galleryParent).height();
		var grabberHeight = $(classAppend + grabber).height();
		
		if (!$(galleryParent).find(classAppend + infoHolder).hasClass(grabberClicked))
			$(galleryParent).find(classAppend + infoHolder).animate({"top": (top - grabberHeight/2) + "px"}, grabberSpeed);
	});
	
	$(classAppend + gallery).mouseleave(function(){
		//main fading out
		$(this).find(classAppend + fadeable).fadeOut(elementFadeSpeed);
		
		var galleryParent = $(this).find(classAppend + viewer);
		var top = $(galleryParent).height();
		var grabberHeight = $(classAppend + grabber).height();
		
		if (!$(galleryParent).find(classAppend + infoHolder).hasClass(grabberClicked))
			$(galleryParent).find(classAppend + infoHolder).animate({"top": (top + grabberHeight) + "px"}, grabberSpeed);
	});
	
	$(classAppend + grabber).click(function(){
		var parentHeight = $(this).parents(classAppend + infoHolder).height();
		var galleryParent = $(this).parents(classAppend + viewer);
		var top = $(galleryParent).height();
		var grabberHeight = $(classAppend + grabber).height();
		var currentTop = parseInt($(this).parents(classAppend + infoHolder).css("top"));
		
		if (currentTop == top - parentHeight)
		{
			$(this).parents(classAppend + infoHolder).animate({"top": top - grabberHeight/2}, grabberSpeed);
			$(this).parents(classAppend + infoHolder).removeClass(grabberClicked);
		}
		else
		{
			$(this).parents(classAppend + infoHolder).animate({"top": top - parentHeight}, grabberSpeed);
			$(this).parents(classAppend + infoHolder).addClass(grabberClicked);
		}
	});
	
	//viewer arrows animate
    viewerArrows.click(function() {
		//arrows initialize
        traverse(this);
    });
	
	function traverse(me){
		//traverses the gallery and displays next image
		//
		var viewerParent = $(me).parents(classAppend + gallery).find(classAppend + viewer);
        var imageHolders = $(viewerParent).find(classAppend + viewerImage);
        var galleryParent = $(me).parents(classAppend + gallery);
        var sliderImages = $(galleryParent).find(classAppend + sliderElements + " img");
		var infoItem = $(galleryParent).find(classAppend + info);

        var index = sliderIndex(galleryParent);

        var isLeftArrow = $(me).hasClass(leftArrow);
        var numImages = numGalleryImages(galleryParent);

        if ((isLeftArrow && index != 0) || (!isLeftArrow && index < numImages - 1)) {
            var visibleImage = $(viewerParent).find(visibleImageClass);
            var currentViewerIndex = $(imageHolders).index(visibleImage);
            var plusMinus;
            isLeftArrow ? plusMinus = -1 : plusMinus = 1;
            imageHolders.each(function(i, el) {
                if (i == currentViewerIndex) 
				{
                    $(el).fadeOut(fadeSpeed, function() {				
						$(galleryParent).find(visibleSliderClass).removeClass(visibleSliderClassName);
						$($(sliderImages.get(index + plusMinus))).addClass(visibleSliderClassName);
						var newInfo = getText($(sliderImages.get(index + plusMinus)));
						$(infoItem).html(  newInfo);
						migrate(this, true);				
                    });
                }
				else
				{
					if (index + plusMinus > -1 && index + plusMinus < numImages) 
					{
						var nextEl = $(sliderImages.get(index + plusMinus));
						$(el).find("img").attr('src', nextEl.attr('src'));		
					}
					$(el).fadeIn(fadeSpeed, function() {						
						$(galleryParent).find(visibleImageClass).removeClass(visibleImageName);	
						$(el).addClass(visibleImageName);	
                    });
				}
            });
        }
	}
	
	function getText(el){
		var message = $(el).attr("alt");	
		var id = parseInt($(el).attr("id"));
		var arrayMessage = TextArray[id];
		typeof message === 'undefined' ? message =  arrayMessage : message = message;
		
		return message;
	}
	
	//moves the slider (snap snaps the slider to the current image)
	function migrate(me, snap){
		
		var galleryParent = $(me).parents(classAppend + gallery);
		var slider = $(galleryParent).find(classAppend + sliderElements);
		var images = $(slider).find("img");
		var totalWidth = 0;
		var snapWidth = 0;
		var currentMargin = parseInt($(slider).css("margin-left"));
		var isLeftArrow = $(me).hasClass(leftArrow);
		var plusMinus;
            isLeftArrow ? plusMinus = 1 : plusMinus = -1;
		var currentImage = $(galleryParent).find(visibleSliderClass);
		var currentIndex = $(images).index(currentImage);
		
		//get total width
		$(images).each(function(index,el){
			var elWidth = $(el).outerWidth() + parseInt($(el).css("margin-right"));
			totalWidth += elWidth;
			if (index < currentIndex)
			{
				snapWidth += elWidth;
			}
		});
				
		var addToMargin = 0;
		
		//get width of current element + margin
		var max = $(classAppend + window).width() - $(classAppend + sliderArrow).width();
		if ((isLeftArrow && currentMargin < 0) || (!isLeftArrow && -currentMargin < totalWidth - max))
		{
			addToMargin = $(currentImage).outerWidth() + parseInt($(currentImage).css("margin-right"));
		}
		
		if (snap)
		{
			if (snapWidth < totalWidth - max)
				addToMargin = -snapWidth;
			else
				addToMargin = -(totalWidth - max);
		}
		else
		{
			addToMargin = currentMargin + (plusMinus *  addToMargin);
		}
		
		$(slider).animate({"margin-left": addToMargin + "px"}, sliderSpeed, sliderEasing);
	}
	
	$(classAppend + sliderElements + " img").click(function(){
		
		//slider elements clicking
		$(this).parents(classAppend + gallery).find(visibleSliderClass).removeClass(visibleSliderClassName);
		$(this).addClass(visibleSliderClassName);
		var viewerParent = $(this).parents(classAppend + gallery).find(classAppend + viewer);
        var imageHolders = $(viewerParent).find(classAppend + viewerImage);
		var visibleImage = $(viewerParent).find(visibleImageClass);
		var currentViewerIndex = $(imageHolders).index(visibleImage);
		var clickedEl = this;
		var infoItem = $(viewerParent).find(classAppend + info);
		
		imageHolders.each(function(i, el) {
			if (i == currentViewerIndex) 
			{
				$(el).fadeOut(fadeSpeed);
			}
			else
			{
				$(el).find("img").attr('src', $(clickedEl).attr('src'));		
				$(el).fadeIn(fadeSpeed, function() {				
					$(viewerParent).parents(classAppend + gallery).find(visibleImageClass).removeClass(visibleImageName);	
					$(el).addClass(visibleImageName);
					var newInfo = getText($(clickedEl));
					$(infoItem).html( newInfo);	
					migrate(this, true);				
				});
			}
        });
	});
	
	$(classAppend + sliderArrow).click(function(){
		migrate(this);		
	});

    function sliderIndex(parent) {
        var sliderImages = $(parent).find(classAppend + sliderElements + " img");
        var currentImageShown = $(parent).find(visibleSliderClass);

        return $(sliderImages).index(currentImageShown);
    }
	
	function thisIndex(el, parent){
		var sliderImages = $(parent).find(classAppend + sliderElements + " img");

        return $(sliderImages).index(el);
	}

    function numGalleryImages(parent) {
        var images = $(parent).find(classAppend + sliderElements + " img");

        return images.length;
    }
});