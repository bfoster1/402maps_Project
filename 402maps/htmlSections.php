<section>
  <!--bootstap attributes to create carousel -->
	<div class="jumbotron"> 
		<div id="myCarousel" class="carousel slide" data-ride="carousel">
  <!--places the images in the carousel/slideshow by forming a list of the images-->
  <ol class="carousel-indicators" align="middle">
    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-slide-to="1"></li>
    <li data-target="#myCarousel" data-slide-to="2"></li>
    <li data-target="#myCarousel" data-slide-to="3"></li>
  </ol>

  <!-- Wrapper for slides -->
  <div class="carousel-inner" role="listbox">
    <div class="item active">  
  <!-- Images, content, and title for each slide -->
      <img src="img/meat.jpg" width="980px" height="350px" align="middle" alt="chicago">
      <div class="carousel-caption">
        <h3>Eat Good!</h3>
        <p>Chicago is one of the best cities for food</p>
      </div>
    </div>

    <div class="item">
      <img src="img/sandwich.jpg" width="980px" height="350px" align="middle" alt="sandwich">
      <div class="carousel-caption">
        <h3>Find the best Restuarants</h3>
        <p>Get a taste of Chicago.</p>
      </div>
    </div>

    <div class="item">
      <img src="img/meat2.jpg" width="980px" height="350px" align="middle" alt="meat">
      <div class="carousel-caption">
        <h3>Finger-Lickin' Good</h3>
        <p>Whatever you crave, Chicago has!</p>
      </div>
    </div>

    <div class="item">
      <img src="img/entree.jpg" align="middle" width="980px" height="350px" alt="Flower">
      <div class="carousel-caption">
        <h3>Yum! Yum! Yum!</h3>
        <p>Try the different entrees that Chicago has to offer!</p>
      </div>
    </div>
  </div>

  <!-- Left and right controls -->
  <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
    
  <!-- Content for each restaurant -->
		<p>402Maps is a mini project that utilizes Mapbox.js, Html, CSS, JQuery, and Bootstrap. The map view allows users to 
		quickly acces restaurants in a given neighborhood, through the filtering function. This beta version features restaurants 
		in three of Chicago's best neighborhoods for food: Lincoln Park, Chinatown and Pilsen. Everyone deserves to wine and dine 
		themsleves sometimes....that time is NOW! <p><a href="maps.html" class="btn btn-primary" role="button">See Restaurants</a> 
		 </p>
</div>
<div id="neighborhoods" class="container">
 <div  class="row">
  <div class="col-sm-4 col-md-4">
    <div class="thumbnail">
      <img  class="img-circle" src="img/Lincoln_Park.jpg" alt="...">
      <div class="caption">
        <h3>Lincoln Park</h3>
        <p>Lincoln Park represents the "New American" style in dining. Because of its proximity to the Lake and Loop
         and its diverse yet comparatively affluent population, it encompasses everything from high end farm to 
         table to college student-friendly pizza and craft beer.</p>
      </div>
    </div>
  </div>

<div class="col-sm-4 col-md-4">
    <div class="thumbnail">
      <img  class="img-circle" src="img/Chinatown.jpg" alt="...">
      <div class="caption">
        <h3>Chinatown</h3>
        <p>The Chinese represent the largest Asian ethnicity in Chicago and our Chinatown stretches between Archer and Wentworth avenues just south of the loop.
          While Cantonese is the most common offering, there are options for everything from Hunanese to Szechuan to Shanghaiese.</p>
      </div>
    </div>
  </div>

<div class="col-sm-4 col-md-4">
    <div class="thumbnail">
      <img  class="img-circle" src="img/Pilsen.jpg" alt="...">
      <div class="caption">
        <h3>Pilsen</h3>
        <p>One in every five Chicagoans is of Mexican descent, representing the the largest  Latino population in Chicago. The 
        	largest groups reside in neighborhoods on the  Southwest Side like Pilsen, with its plentiful taquerias and carnicerias.</p>
    </div>
  </div>

 </div>
</div>

</section>	
