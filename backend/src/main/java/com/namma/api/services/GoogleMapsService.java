package com.namma.api.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.maps.DistanceMatrixApi;
import com.google.maps.DistanceMatrixApiRequest;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DistanceMatrix;
import com.google.maps.model.LatLng;
import com.google.maps.model.TravelMode;
import com.namma.api.entity.Driver;
import com.namma.api.entity.Ride;

@Service
public class GoogleMapsService {

	@Value("${google.api.key}")
    private  String apiKey; 

    

    public DistanceMatrix getDistance(double pickupLatitude, double pickupLongitude,
                                      double dropLatitude, double dropLongitude)  {
    	
    	GeoApiContext context = new GeoApiContext.Builder()
                .apiKey(apiKey)
                .build();
    	
    	try {
        
        DistanceMatrix result = DistanceMatrixApi.newRequest(context)
                .origins(pickupLatitude + "," + pickupLongitude)
                .destinations(dropLatitude + "," + dropLongitude)
                .mode(TravelMode.DRIVING)
                .await();
          return result;
    	}catch (Exception e) {
	          e.printStackTrace();
	          return null;
		}finally {
			context.shutdown();
		}
    }
    
    
    private static final double DISTANCE_THRESHOLD_KM=1.0;
    
    public boolean isDriverNearby(Driver driver, Ride ride) throws Exception {
    	GeoApiContext context = new GeoApiContext.Builder()
                .apiKey(apiKey)
                .build();
        LatLng driverLatLng = new LatLng(driver.getLocation().getLatitude(), driver.getLocation().getLongitutde());
        LatLng rideLatLng = new LatLng(ride.getLocation().getPickUplatitude(),ride.getLocation().getPickUplongitude());
        

        DistanceMatrixApiRequest request = DistanceMatrixApi.newRequest(context);
        DistanceMatrix matrix = request.origins(driverLatLng).destinations(rideLatLng).await();

        if (matrix.rows.length > 0 && matrix.rows[0].elements.length > 0) {
            double distanceKm = matrix.rows[0].elements[0].distance.inMeters / 1000.0;
            return distanceKm <= DISTANCE_THRESHOLD_KM;
        } else {
            throw new Exception("Failed to calculate distance between coordinates.");
        }
        
    	
        
    }
    
    
    

    
         

}