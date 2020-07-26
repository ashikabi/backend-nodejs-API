const user = {
  table: "user",
  columns: ['id',
            'email',
            'password',
            'role',
            'status', // ==> A: active ; I: inactive ; P: pending
            'created'],
  where: `1=1 ` //without any special filter
};

const movie = {
  table: "movie",
  columns: ['id',
            'title',
            'description',
            'image',
            'stock',
            'rentalPrice',
            'salePrice',
            'availability', // ==> 0: no ; 1: yes
            'status'], // ==> D: deleted, A: active, R: removed/hide
  where: "status='A' " //by default only actives
};

const movieLike = {
  table: "movie_like",
  columns: ['id',
            'movieId',
            'userId',
            'like'], // ==> 0: unlike ; 1: like
  where: "like=1 " //by default only likes (because you can unlike as well n_n)
};

const movieLog = {
  table: "movie_log",
  columns: ['id',
            'movieId',
            'oldTitle',
            'newTitle',
            'oldRentalPrice',
            'newRentalPrice',
            'oldSalePrice',
            'newSalePrice',
            'updateDate'], 
  where: "1=1 " 
};

const movieRental = {
  table: "movie_rental",
  columns: ['id',
            'userId',
            'movieId',
            'rentalDate',
            'shouldReturnDate',
            'returnDate',
            'penalty'], 
  where: "1=1 " 
};

const purchaseAndRental = {
  table: "purchase_and_rental",
  columns: ['id',
            'userId',
            'movieId',
            'transaction',//==> P: purchase ; R: rental
            'quantity',
            'transactionDate'], 
  where: "1=1 " 
};

module.exports = {  user,
                    movie,
                    movieLike,
                    movieLog,
                    movieRental,
                    purchaseAndRental
                  }