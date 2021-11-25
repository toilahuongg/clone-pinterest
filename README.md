# Bài Tập Lớn Python
## Thành viên
* Vũ Bá Hướng (leader)
* Phan Thanh Hải
* Phan Thiên Hưng
* Vũ Kim Phúc
* Bùi Ngọc Anh
# Install Project
## Backend
``` cd backend ```
### Config
- copy file **.env.example** and rename this to **.env**
- Setup Environment ``` python -m venv venv ``` 
- Activate ``` . venv/Scripts/activate ```
- Install packages: ``` pip install -r requirements.txt ```
### Before deploying
``` pip freeze > requirements.txt ```
### Run server
``` flask run ```
## Frontend
``` cd frontend ```
- install **Nodejs**
- copy file **.env.example** and rename this to **.env**
### Install packages
``` npm install ```
### Run server
``` npm run start ```