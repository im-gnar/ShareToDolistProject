

db = [{'id':'test@naver.com', 'pwd':'1234'}, {'id':'test2@naver.com', 'pwd':'5678'}]
id = 'test@naver.com'
pwd = '1234'


# print(db[0]['id'])
# print(db[1]['id'])
# for i in range(0, len(db)):
#     if id in db[i]['id']:
#         print(id)

for i in range(0, len(db)):
    Error = None
    if id not in db[i]['id']:
        Error = "ID does not exist"
    # password diff error
    elif db[i]['pwd'] != pwd:
        Error = "Password does not match"
    print(Error)
