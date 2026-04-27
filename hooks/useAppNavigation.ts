import { useNavigation } from "@react-navigation/native";
import { IPage } from "../interfaces";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PAGES } from "../utils/pages";

export default function useAppNavigation() {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    function navigate(page: IPage, param?: object | undefined) {

        navigation.navigate(page.name, param)
    }

    function goBack() { 

        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate(PAGES.home.name);
        }
    }

    return {
        navigate,
        goBack
    }



}