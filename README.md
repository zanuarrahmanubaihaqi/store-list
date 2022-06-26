# basic-record-transaction
resto listing (open and close hour) with laravel 7 and mysql

# Installation
- after clone this repository
- run `composer install`
- rename or copy `.env.example` file to `.env`
- run `php artisan key:generate`
- set database connection in `.env`
- run `php artisan migrate`
- run `php artisan db:seed`
- run `composer require yajra/laravel-datatables:^1.5`
- open the file config/app.php and then add following service provider with `Yajra\DataTables\DataTablesServiceProvider::class,` and aliases with `'DataTables' => Yajra\DataTables\Facades\DataTables::class,`
- run `php artisan vendor:publish --tag=datatables`

# Note
- run file .sql (data-resto.sql) to fill the init data
- before login edit methode `username()` at file `AuthenticatesUsers.php` vendor/laravel/ui/auth-backend/AuthenticatesUsers.php return 'email' to return 'username'
- admin : username -> admin & password -> admin123
- guest : username -> guest & password -> guest123

# Screen Shoot
![image](https://user-images.githubusercontent.com/68091801/175824500-19b8e752-1293-4bba-9d38-50eaf833d685.png)
![image](https://user-images.githubusercontent.com/68091801/175824520-0e866d77-27a6-4a7d-9ee0-ffa60c23926b.png)
![image](https://user-images.githubusercontent.com/68091801/175824530-dbb73a73-5ba7-485b-9eed-b3c595d4635d.png)
![image](https://user-images.githubusercontent.com/68091801/175824544-dec4a7de-e69c-4f44-8828-2abc6ba09cac.png)
![image](https://user-images.githubusercontent.com/68091801/175824552-15cf0f88-b526-4db3-a222-6cae549db98d.png)
![image](https://user-images.githubusercontent.com/68091801/175824564-18a4275a-6784-46f5-8d79-314ef1db0cb9.png)
![image](https://user-images.githubusercontent.com/68091801/175824609-f08ae6d2-e472-4ad1-a2a9-6ee76bcc65cf.png)
![image](https://user-images.githubusercontent.com/68091801/175824694-0c0b1aba-2725-483d-add8-d2d8633703d9.png)
![image](https://user-images.githubusercontent.com/68091801/175824710-18626c01-231d-462e-983f-6cbeeb4a77cc.png)

