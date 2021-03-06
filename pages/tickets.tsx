import WithAuth from "../components/withAuth";
import type { NextPage } from "next";
import {
    Heading,
    Box,
    SimpleGrid,
    useDisclosure,
    Flex,
    IconButton,
    Spacer,
    Button,
} from "@chakra-ui/react";
import { RepeatIcon, AddIcon } from "@chakra-ui/icons";
import { QueryUserTickets, QueryInProgressTicket} from "../query/ticket";
import { TicketBox } from "../components/ticket";
import { useState, useEffect } from "react";
import { useUserContext } from "../lib/firebaseHook";
import Link from "next/link";

const Tickets: NextPage = () => {
    const { user, loading } = useUserContext();
    const [tickets, setTickets] = useState<any>();
    const [ipTickets, setIpTickets] = useState<any>();
    //This make sure it only query when firebase is done loading/auth*ing the user.
    useEffect(() => {
        if (!loading && user) {
            //Getting tickets that are open and not created by the user and has a limit of 10 documents
            //@ts-ignore
            getTicket();
        }
    }, [loading]);

    function getTicket() {
        QueryUserTickets(10, user.uid)
            .then((docs) => {
                setTickets(docs);
            })
            .catch((err) => {
                console.log(err);
            });
        QueryInProgressTicket(10, user.uid)
            .then((docs) => {
                setIpTickets(docs);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    let openTickets: any = [];
    tickets?.forEach((ticket: any) => {
        openTickets.push(
            <Box key={ticket.id}>
                <TicketBox
                    ticket={ticket.data()}
                    type="Delete"
                    id={ticket.id}
                />
            </Box>
        );
    });

    let inProgressTickets: any = [];
    ipTickets?.forEach((ticket: any) => {
        inProgressTickets.push(
            <Box key={ticket.id}>
                <TicketBox
                    ticket={ticket.data()}
                    type="Edit"
                    id={ticket.id}
                />
            </Box>
        );
    });

    return (
        <Box width="100%" p="3em" mt={10}>
            <Link href="/createticket">
                <Button colorScheme="teal" rightIcon={<AddIcon />} mb={5}>
                    Create
                </Button>
            </Link>
            <SimpleGrid gap={2} spacing={5} borderRadius="10px">
                <Flex>
                    <Heading>Pending Tickets</Heading>
                    <Spacer />
                    <IconButton
                        aria-label="refresh"
                        colorScheme="blue"
                        variant="outline"
                        icon={<RepeatIcon />}
                        onClick={() => getTicket()}
                    />
                </Flex>
                {openTickets}
                {openTickets.length < 1 ? "Empty" : null}
            </SimpleGrid>


            <SimpleGrid gap={2} spacing={5} borderRadius="10px" mt="100px">
                <Flex>
                    <Heading>In Progress</Heading>
                    <Spacer />
                    <IconButton
                        aria-label="refresh"
                        colorScheme="blue"
                        variant="outline"
                        icon={<RepeatIcon />}
                        onClick={() => getTicket()}
                    />
                </Flex>
                {inProgressTickets}
                {inProgressTickets.length < 1 ? "Empty" : null}
            </SimpleGrid>
        </Box>
    );
};

export default WithAuth(Tickets);
