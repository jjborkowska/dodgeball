abstract class Animal {
    private animalName: string
    protected name: string
    public coolName: string

    public constructor(name: string) {
        this.animalName = name = ' a'
        this.name = name = " n"
        this.coolName = name + " c"
    }
}

class Dog extends Animal {
    public makeSound() {
        console.log(this.coolName)
    }
}

class GoldenRetriever extends Dog {
    public makeSound() {
        console.log(this.name)
    }
}

const dog = new Dog("fred")
const goldenRetriever = new GoldenRetriever("bart")
goldenRetriever.makeSound()

const dictionary = {
    "key": "value",
    "isGay": true
}

console.log(dictionary["key"])