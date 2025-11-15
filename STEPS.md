1. cd fabric-samples/
   cd test-network/

2. ./network.sh down

3. ./network.sh up createChannel -c mychannel -ca

4. ./network.sh deployCC -ccn topiccc -ccp ../chaincode/topic -ccl javascript

5. export PATH=${PWD}/../bin:$PATH

6. export FABRIC_CFG_PATH=$PWD/../config/

7. # Environment variables for Org1
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

8. # Environment variables for Org2
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org2MSP
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

9. # Chạy init ledger
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n topiccc --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"initLedger","Args":[]}'

10. # Kiểm tra dữ liệu
## Lấy thông tin đề tài
peer chaincode query -C mychannel -n topiccc -c '{"function":"getTopicById","Args":["T001"]}'
## Đăng ký đề tài mới:
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n topiccc --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"registerTopic","Args":["1", "test", "for test", "22810310350", "huy", "Web"]}'
## Giảng viên duyệt đề tài
peer chaincode invoke -o localhost:7050   --ordererTLSHostnameOverride orderer.example.com   --tls   --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem   -C mychannel -n topiccc   --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --waitForEvent -c '{"function":"approveTopic","Args":["T001"]}'
## Cập nhật tiến độ
peer chaincode invoke -o localhost:7050   --ordererTLSHostnameOverride orderer.example.com   --tls   --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem   -C mychannel -n topiccc   --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --waitForEvent -c '{"function":"updateProgress","Args":["T001", "50", "Dang thuc hanh chaincode"]}'
## Lấy lịch sử thay đổi của đề tài
peer chaincode query -C mychannel -n topiccc -c '{"function":"getTopicHistory","Args":["T001"]}'

{
  "topicId": "T001",
  "topicName": "Ứng dụng Blockchain trong giáo dục",
  "studentId": "SV001",
  "studentName": "Nguyễn Văn A",
  "supervisorId": "GV001",
  "supervisorName": "ThS. Trần Văn B"
}


# student
cp fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json fabric-samples/chaincode/topic/server/connection/
cp fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/* fabric-samples/chaincode/topic/server/wallet/org1User/cert.pem
cp fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/* fabric-samples/chaincode/topic/server/wallet/org1User/private.key

# supervisor
cp fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json fabric-samples/chaincode/topic/server/connection/
cp fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/signcerts/* fabric-samples/chaincode/topic/server/wallet/org2User/cert.pem
cp fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/keystore/* fabric-samples/chaincode/topic/server/wallet/org2User/private.key

# admin
cp fabric-samples/test-network/organizations/peerOrganizations/admin.example.com/connection-admin.json server/connection/
cp fabric-samples/test-network/organizations/peerOrganizations/admin.example.com/users/User1@admin.example.com/msp/signcerts/* server/wallet/adminUser/cert.pem
cp fabric-samples/test-network/organizations/peerOrganizations/admin.example.com/users/User1@admin.example.com/msp/keystore/* server/wallet/adminUser/private.key