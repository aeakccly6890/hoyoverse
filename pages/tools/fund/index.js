import React, {useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography,
    useTheme
} from "@mui/material";
import CurrencyYuanIcon from '@mui/icons-material/CurrencyYuan';
import PercentIcon from '@mui/icons-material/Percent';
import _ from "lodash";
import {useForm} from "react-hook-form";

const Index = () => {
    const theme = useTheme();
    const {control, handleSubmit, setValue} = useForm();
    const [maxFunded, setMaxFunded] = useState(10000)
    const [maxDeclineRate, setMaxDeclineRate] = useState(25)
    const [maxFundedTimes, setMaxFundedTimes] = useState(5)
    const [resultContent, setResultContent] = useState([])

    const createData = ({name, calories, fat, carbs, protein}) => {
        return {name, calories, fat, carbs, protein};
    }

    const calculate = () => {
        const resultList = []
        let total = (maxFundedTimes * (maxFundedTimes + 1)) / 2;
        let ratios = [];
        let declineRate = maxDeclineRate / maxFundedTimes / 100; // 将下跌率转换为小数
        let totalInvestment = 0;
        let currentValue = 0;
        let resultPrint = ""

        // 计算每次加仓的比率
        for (let i = 1; i <= maxFundedTimes; i++) {
            ratios.push((i / total) * 100);
        }

        // 处理每次加仓
        for (let i = 1; i <= ratios.length; i++) {
            let itemFunded = maxFunded * ratios[i - 1] / 100;

            if (i === 1) {
                // 第一次加仓不考虑下跌
                totalInvestment += itemFunded;
                currentValue = itemFunded;
            } else {
                // 先考虑下跌后的市值
                currentValue = currentValue * (1 - declineRate);
                // 然后加上这次的加仓金额
                totalInvestment += itemFunded;
                currentValue += itemFunded;
            }

            resultList.push({
                round: i,
                addFunded: Math.floor(itemFunded),
                declineCurrentRate: (maxDeclineRate / maxFundedTimes).toFixed(2) + "%",
                totalInvestment: Math.floor(totalInvestment),
                declineFunded: i === 1 ? "建仓" : Math.floor(currentValue),
                returnRate: ((1 - currentValue / totalInvestment) * 100).toFixed(2) + "%"
            })
        }
        setResultContent(resultList)
    }

    const handleFundedTimes = (target) => {
        setMaxFundedTimes(target.target.value)
    }
    const handleMaxFunded = (target) => {
        setMaxFunded(target.target.value)
    }
    const handleMaxDeclineRate = (target) => {
        setMaxDeclineRate(target.target.value)
    }

    return (
        <>
            <div className={"w-screen min-h-screen bg-cover bg-center grid place-items-center bg-no-repeat"}>
                <Container>
                    <Card
                        sx={{width: 800, minHeight: 600, margin: "auto", padding: 10, backgroundColor: "transparent"}}>
                        <Box sx={{minWidth: 200}}>
                            <CardContent>
                                <div className={"grid place-items-center"}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyItems: 'center',
                                        alignItems: 'center',
                                        '& > *:not(:last-child)': { // 选择除最后一个元素外的所有子元素
                                            marginRight: 2 // 添加右侧外部间隙
                                        }
                                    }}>
                                        <TextField onChange={handleMaxFunded} value={maxFunded} type={"number"}
                                                   label={"预计操作本金/元"}
                                                   size={"medium"}
                                                   InputProps={{
                                                       endAdornment: <CurrencyYuanIcon color={"primary"}
                                                                                       fontSize={"small"}/>
                                                   }}>
                                        </TextField>
                                        <TextField onChange={handleMaxDeclineRate} value={maxDeclineRate}
                                                   type={"number"}
                                                   label={"预计最大跌幅"}
                                                   size={"medium"}
                                                   InputProps={{
                                                       endAdornment: <PercentIcon color={"primary"}
                                                                                  fontSize={"small"}/>
                                                   }}>
                                        </TextField>
                                        <TextField onChange={handleFundedTimes} value={maxFundedTimes} type={"number"}
                                                   size={"medium"}
                                                   label={"预计加仓次数"}
                                        ></TextField>
                                        <Button variant={"contained"} onClick={calculate}>计算</Button>
                                    </Box>
                                </div>
                            </CardContent>
                        </Box>
                        <TableContainer sx={{backgroundColor: "transparent"}} component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{color: "red"}}>
                                        <TableCell>轮次</TableCell>
                                        <TableCell align="right">下跌率</TableCell>
                                        <TableCell align="right">总成本</TableCell>
                                        <TableCell align="right">总持仓</TableCell>
                                        <TableCell align="right">回本需要</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultContent.map((row, index) => (
                                        <TableRow
                                            key={row.round}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell>{row.round}</TableCell>
                                            <TableCell align="right">{row.declineCurrentRate}</TableCell>
                                            <TableCell align="right">{row.totalInvestment}</TableCell>
                                            <TableCell align="right">{row.declineFunded}</TableCell>
                                            <TableCell align="right">{row.returnRate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Container>
            </div>
        </>
    );
};

export default Index;
